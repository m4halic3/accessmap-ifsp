#!/usr/bin/env bash
# =========================================================================
# Gera as versões em alta resolução das plantas do mapa (assets/images/plantas)
#
# Uso:
#   scripts/gerar-plantas-hd.sh <ala> <imagem-fonte> <largura> <altura>
#
#   <ala>          todos | edificacoes | mecanica  (mesmo nome usado em mapa.js)
#   <imagem-fonte> imagem da planta em alta resolução (de preferência ampliada
#                  4x com IA, ex.: Real-ESRGAN — ver README)
#   <largura> <altura>  área de coordenadas da planta em mapa.js
#                  (plantas[ala].largura / .altura) — NÃO mude esses valores,
#                  senão os pontos cadastrados saem do lugar.
#
# Exemplo:
#   scripts/gerar-plantas-hd.sh todos campus-x4.png 1500 1056
#
# Saída (ex.: ala "todos"):
#   assets/images/plantas/todos/base.webp      2 px por coordenada (sempre carregada)
#   assets/images/plantas/todos/hd/L-C.webp    4 px por coordenada, em GRADE_COLS x
#                                               GRADE_LINHAS pedaços (carregados só
#                                               no zoom, e só os que estão na tela)
#
# Os valores abaixo precisam bater com PLANTA_HD em assets/js/mapa.js.
# Requer ImageMagick 7 (comando `magick`) com suporte a WebP.
# =========================================================================
set -euo pipefail

GRADE_COLS=6
GRADE_LINHAS=4
ESCALA_HD=4          # pixels por unidade de coordenada nos pedaços HD
ESCALA_BASE=2        # pixels por unidade de coordenada na imagem base
SOBREPOSICAO=1       # unidades de coordenada que cada pedaço avança sobre o vizinho
QUALIDADE=88

if [ "$#" -ne 4 ]; then
    sed -n '2,25p' "$0"
    exit 1
fi

ALA="$1"; FONTE="$2"; LARGURA="$3"; ALTURA="$4"

if (( LARGURA % GRADE_COLS != 0 || ALTURA % GRADE_LINHAS != 0 )); then
    echo "Erro: $LARGURA x $ALTURA precisa ser divisível pela grade ${GRADE_COLS}x${GRADE_LINHAS}." >&2
    exit 1
fi

RAIZ="$(cd "$(dirname "$0")/.." && pwd)"
DESTINO="$RAIZ/assets/images/plantas/$ALA"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

rm -rf "$DESTINO"
mkdir -p "$DESTINO/hd"

W=$(( LARGURA * ESCALA_HD )); H=$(( ALTURA * ESCALA_HD ))
echo "• Redimensionando para ${W}x${H} (mesma área de coordenadas do mapa)..."
magick "$FONTE" -filter Lanczos -resize "${W}x${H}!" "$TMP/hd.png"

echo "• Imagem base ($(( LARGURA * ESCALA_BASE ))x$(( ALTURA * ESCALA_BASE )))..."
magick "$TMP/hd.png" -filter Lanczos -resize "$(( LARGURA * ESCALA_BASE ))x$(( ALTURA * ESCALA_BASE ))!" \
    -quality "$QUALIDADE" -define webp:method=6 "$DESTINO/base.webp"

CW=$(( LARGURA / GRADE_COLS )); CH=$(( ALTURA / GRADE_LINHAS ))
echo "• Pedaços HD (${GRADE_COLS}x${GRADE_LINHAS})..."
for (( l = 0; l < GRADE_LINHAS; l++ )); do
    for (( c = 0; c < GRADE_COLS; c++ )); do
        # Limites em coordenadas (com sobreposição, presos às bordas da planta).
        # Linha 0 = faixa de cima da imagem.
        x0=$(( c * CW - SOBREPOSICAO )); (( x0 < 0 )) && x0=0
        x1=$(( (c + 1) * CW + SOBREPOSICAO )); (( x1 > LARGURA )) && x1=$LARGURA
        y0=$(( l * CH - SOBREPOSICAO )); (( y0 < 0 )) && y0=0
        y1=$(( (l + 1) * CH + SOBREPOSICAO )); (( y1 > ALTURA )) && y1=$ALTURA

        magick "$TMP/hd.png" \
            -crop "$(( (x1 - x0) * ESCALA_HD ))x$(( (y1 - y0) * ESCALA_HD ))+$(( x0 * ESCALA_HD ))+$(( y0 * ESCALA_HD ))" +repage \
            -quality "$QUALIDADE" -define webp:method=6 "$DESTINO/hd/$l-$c.webp"
    done
done

du -sh "$DESTINO/base.webp" "$DESTINO/hd" | sed 's/^/  /'
echo "Pronto: $DESTINO"
