PARQUE INFINITO — PACOTE REDUZIDO COMPLETO
116 PNGs individuais nas nove pastas do inventário.

USO
Os PNGs estão em escala 2x para preservar o acabamento: personagem de 64x96 representa 32x48 unidades no jogo; tile de 64x64 representa 32x32.
Use os tamanhos lógicos e anchors em asset_manifest.json. Renderize com imageSmoothingEnabled=false / image-rendering: pixelated. Não use a largura natural do PNG como unidade lógica sem aplicar pixel_scale=2.
O anchor dos personagens é (0.5, 92/96); alinhe essa coordenada à posição de contato no mapa. PNGs de personagens têm a mesma caixa 64x96.

ANIMAÇÕES
player_walk_*_01/02: ciclo de dois quadros a 150 ms por quadro. Pausado: player_idle_*.
phone/tired e NPCs: alterne idle com walk_01 a 220 ms por quadro.
host_talk_01 alterna com host_idle_down durante fala.
UI está sem textos, exceto E (interação), SAIDA e FIM nas placas. Textos de diálogos e menus devem ser renderizados pelo jogo.
Barras incluem preenchimento: use fill_rect do manifesto para recortar a largura segundo o valor atual.

PRODUÇÃO
Bases produzidas com geração de imagens integrada, mantendo o acabamento 16-bit aprovado: contorno azul profundo, luz quente, cores vivas, textura e sombras em camadas. Foram reaproveitadas bases prontas e geradas novas vistas, estados e objetos. Recortes, normalização, UI, símbolos e preparação de quadros foram montados para exportação no formato do jogo.
O conjunto é de sprites individuais, sem sprite sheets. Não contém o antigo pacote de 273 imagens.

VERIFICAÇÃO
116/116 nomes únicos conferidos com o inventário; nenhum PNG extra ou ausente.
Todos os PNGs abrem, contêm pixels visíveis e têm conteúdo distinto.
RGBA com transparência fora dos objetos; chão opaco.
Bordas dos seis pisos-base conferidas para repetição contínua.
Caixa consistente em todos os quadros de personagens.
ZIP com verificação de integridade.
A conferência deste pacote é de assets e animações isoladas; integração com o código do jogo não faz parte deste arquivo.

FONTES SUGERIDAS
Menu: Press Start 2P; diálogos: VT323; HUD: Pixel Operator. Fontes não incluídas.
