# Parque Infinito

Versão revisada do projeto enviado: o mesmo caminho em zigue-zague, as cinco atrações, a Praça Tranquila e os 116 sprites originais.

## Abrir e jogar

1. Extraia o ZIP inteiro.
2. Abra `index.html` em um navegador com JavaScript habilitado.
3. Aguarde o carregamento das imagens e clique em JOGAR.

Não é necessário instalar dependências, compilar, criar uma conta ou ter conexão com a internet. Mantenha `index.html`, `style.css`, `script.js` e a pasta `assets` juntos. O som começa após o primeiro clique e pode ser desligado.

## Controles

- WASD ou setas: andar.
- E: interagir com atrações, anfitrião e saída.
- ESC: pausar e continuar, inclusive durante atrações.
- M: ligar ou desligar o som.
- Mouse ou teclas indicadas: jogar as atrações.
- Em telas de toque, controles direcionais e botão E aparecem durante o percurso.

## O percurso

Entrada → Túnel Infinito → Praça das Curtidas → Torre das Notificações → Galeria Perfeita → Salão das Tendências → Praça Tranquila → Saída.

Cada atração dura 40 segundos. Acertos rendem pontos, mas errar ou não apertar botões não impede a conclusão. Ao terminar, clique em SEGUIR PELO PARQUE. O portão correspondente se abre uma única vez. Voltar é permitido; atrações já concluídas não distribuem pontos novamente.

A Praça Tranquila é uma passagem de contemplação. Sentar no banco é opcional. Depois dela, aproxime-se da cortina e pressione E para sair.

O HUD mostra pontos e um horário fictício. Esse horário representa a passagem narrativa da tarde para a noite; o tempo real jogando aparece separadamente no final. Não existe derrota por esgotamento de tempo.

A duração prevista é de 5 a 8 minutos, conforme leitura, exploração e pausas. A travessia automatizada, direta e sem leitura inicial, levou aproximadamente 4min47s.

## Organização

- `index.html`: menus, HUD, diálogos, controles de toque e painéis das atrações.
- `style.css`: interface, escalas e adaptações de tela.
- `script.js`: carregamento, mapa, câmera, movimento, colisões, atrações, deterioração, som e estados da partida.
- `assets/`: os 116 PNGs originais e seu manifesto.
- `REVISAO.md`: problemas encontrados, mudanças e alcance dos testes.

O jogo continua em HTML, CSS e JavaScript puro. O áudio usa síntese simples pelo navegador; não há músicas ou arquivos externos a baixar.
