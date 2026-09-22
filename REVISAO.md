# Revisão do Parque Infinito

## Problemas encontrados

- O cenário e as atrações não tinham colisões físicas: apenas o limite do caminho e alguns portões bloqueavam o jogador.
- Portões não cobriam toda a passagem e as interações não verificavam a sequência das atrações.
- As atrações eram caixas de texto concluídas com um clique. A experiência não sustentava o ritmo solicitado.
- Havia cinco barras no HUD e uma derrota automática por falta de tempo, que podia interromper a narrativa antes do final.
- A pausa não funcionava dentro das atrações. Teclas repetidas, perda de foco e reinícios não eram tratados de maneira uniforme.
- O carregamento tardio das imagens podia produzir quadros sem sprites. Objetos eram desenhados sem considerar sua profundidade.
- NPCs trocavam de aparência ao usar o celular, perdendo sua identidade visual.
- Textos e notificações explicavam a mensagem repetidamente. A Praça Tranquila exigia outra escolha de diálogo.
- O tamanho da câmera dependia diretamente da janela e podia mostrar áreas além do mundo em telas grandes.
- O README acumulava descrições de versões anteriores e citava um manifesto com nome incorreto.

## Correções e melhorias

- Preservados os 12 pontos centrais do caminho original, os nomes e a sequência das atrações, o estilo e todos os 116 PNGs, sem alterar seus bytes.
- Ajustados largura do percurso, posições locais dos objetos e áreas de acesso às atrações para compatibilizar desenho e colisões.
- Colisões circulares nos pés do jogador, movimento dividido em pequenos passos e velocidade diagonal normalizada.
- Portões cobrindo toda a passagem, com abertura visível; sequência validada também na interação; recompensas protegidas contra repetição.
- Carregamento completo das 116 imagens antes de habilitar JOGAR e mensagem de erro caso arquivos estejam ausentes.
- Desenho dos personagens e objetos por profundidade, proporções preservadas e suavização de imagens desativada.
- Mais referências visuais de parque: fontes, barracas, bancos, iluminação, lixeiras, bandeirolas, flores e vegetação nas bordas.
- Transição gradual do chão; desgaste individual de árvores, arbustos, bancos, postes, fontes, barracas, placas e flores; rachaduras e lixo em posições estáveis.
- As atrações ganham desgaste de cor e rachaduras por composição no Canvas, usando as bases fornecidas. Nenhum sprite novo precisa ser produzido.
- NPCs mantêm a própria roupa e aparência, passam a olhar pequenos celulares, se afastam e reduzem seus movimentos.
- HUD reduzido a pontos e horário. Tempo narrativo e duração real são diferenciados.
- Diálogo inicial único, textos curtos, menos notificações e silêncio após a última atração.
- Final único, breve e sem julgamento do jogador. Não existe encerramento antecipado por falta de energia ou tempo.
- Estados explícitos para menus, diálogos, atrações, pausa, saída e encerramento; pausa automática ao perder foco; reinício limpa os estados da partida.
- Câmera suavizada, com limites e escala ajustados à janela. Controles de toque complementam o foco em desktop.
- Sons discretos sintetizados pelo navegador, com botão para desligar e silêncio no trecho final.

## Atrações

| Atração | Atividade | Recompensa aparente |
|---|---|---|
| Túnel Infinito | Avançar entre pequenos quadros | Descoberta e entretenimento |
| Praça das Curtidas | Compartilhar na faixa do marcador | Popularidade |
| Torre das Notificações | Abrir a janela iluminada | Conexão |
| Galeria Perfeita | Escolher e guardar cenas iluminadas | Inspiração e seleção de momentos |
| Salão das Tendências | Acompanhar as luzes que mudam | Novidade |

As cinco atividades terminam após 40 segundos, independentemente da pontuação. As recompensas aumentam os números sem conceder vantagens de movimento ou restaurar o parque.

## Verificação realizada

- Leitura do código, documentos e manifesto; inspeção visual e decodificação dos 116 sprites.
- Sintaxe JavaScript validada; referências de HTML/CSS e IDs conferidos.
- Comparação dos PNGs com o pacote de origem: 116 de 116 idênticos.
- Busca automatizada de caminhos, com colisões reais do jogo: todas as cinco atrações alcançáveis na ordem; os cinco portões impedem acesso antecipado à próxima etapa.
- Travessia completa do início à cortina, executando movimento e colisões, as cinco atrações, suas recompensas, a passagem silenciosa e o encerramento.
- Aproximadamente 4min47s de tempo simulado jogando, com cerca de 6.483 unidades percorridas; leitura da introdução e pausas não incluídas.
- Pausa e retorno nas cinco atrações; bloqueio de repetição de E; pontuação protegida contra conclusão repetida; interação com atrações já usadas.
- Reinício, dez reinícios consecutivos, perda de foco, limpeza das teclas e permanência prolongada sem final prematuro.
- Atividade concluída sem nenhuma entrada; ausência de asset impede início silenciosamente incompleto.
- Velocidade diagonal, colisão com portões sob deslocamento grande e botão de pausa nas atrações.
- Limites e cobertura da câmera em 1920×1080, 3840×2160, 800×600, 390×844 e 667×375.
- Cenas renderizadas e inspecionadas: entrada, estados intermediários, deterioração avançada e saída.

### Limitação da verificação

Os testes de execução usaram JavaScript com DOM simulado e renderização Canvas por Skia. O navegador disponível bloqueou a abertura de arquivos locais por sua política de segurança; portanto, não foi possível concluir uma partida em um navegador real neste ambiente. O layout CSS, os controles de toque e a reprodução sonora não tiveram validação interativa em dispositivos reais. As verificações de resolução cobrem o cálculo do Canvas e da câmera, não equivalem a testes visuais completos do HTML em cada navegador.

## Arquivos alterados

Mudanças principais: `script.js`, `style.css` e `index.html`.

Documentação atualizada: `README.md` e `assets/README_assets_116.txt`. Este `REVISAO.md` foi acrescentado. `assets/asset_manifest.json` e os 116 PNGs foram preservados.
