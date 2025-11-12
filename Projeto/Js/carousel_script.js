let currentIndex = 0;
const slidesToShow = 3; 
const imagens = [
  {
    src: "projeto2.png",
    titulo: "Projeto 1 - Social Selling",
    data: "01/06/2025",
    descricao: "Tcc em desenvolvimento no ano de 2025",
    largura: "600px",
    altura: "350px"
  },
  {
    src: "img4.jpg",
    titulo: "Projeto 2 - Marca Digital",
    data: "02/06/2025",
    descricao: "Trabalho final do ano de 2024, no 3º.",
    largura: "600px",
    altura: "350px"
  },
  {
    src: "modelo-01.png",
    titulo: "Projeto 3 - Vendas Estratégicas",
    data: "03/06/2025",
    descricao: "Lugar aonde foi desenvolvidos o projetos",
    largura: "600px",
    altura: "350px"
  }

];
function moveSlide(step) {
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const slideWidth = slides[0].clientWidth;
  const totalSlides = slides.length;

  currentIndex += step * slidesToShow;

 
  if (currentIndex >= totalSlides) currentIndex = 0;
  if (currentIndex < 0) currentIndex = totalSlides - slidesToShow;

  const translateX = -slideWidth * currentIndex;
  track.style.transform = `translateX(${translateX}px)`;

}
function moveSlide(step) {
  const track = document.querySelector('.carousel-track');
  const slides = document.querySelectorAll('.carousel-slide');
  const slideWidth = slides[0].clientWidth;
  const totalSlides = slides.length;

  currentIndex += step * slidesToShow;

  if (currentIndex >= totalSlides) currentIndex = 0;
  if (currentIndex < 0) currentIndex = totalSlides - slidesToShow;

  const translateX = -slideWidth * currentIndex;
  track.style.transform = `translateX(${translateX}px)`;
}

function openWindow(index) {
  const imagemInfo = imagens[index];

  const popW = 800, popH = 700;
  const w = screen.availWidth;
  const h = screen.availHeight;
  const leftPos = (w - popW) / 2;
  const topPos = (h - popH) / 2;

  const msgWindow = window.open('', 'popup',
    `width=${popW},height=${popH},top=${topPos},left=${leftPos},scrollbars=yes`);

  msgWindow.document.write(`
    <html>
      <head>
        <title>${imagemInfo.titulo}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          img {
            width: ${imagemInfo.largura};
            height: ${imagemInfo.altura};
            border-radius: 8px;
            display: block;
            margin-bottom: 15px;
          }
          h1 {
            margin-top: 0;
          }
          .info {
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <h1>${imagemInfo.titulo}</h1>
        <div class="info"><strong>Data de criação:</strong> ${imagemInfo.data}</div>
        <img src="${imagemInfo.src}" alt="${imagemInfo.titulo}">
        <p><strong>Descrição:</strong> ${imagemInfo.descricao}</p>
        <button onclick="window.close()">Fechar</button>
      </body>
    </html>
  `);
}



        function toggleSection(id) {
            const section = document.getElementById(id);
            section.classList.toggle('active');
        }
    
	
		function toggleMenu() {
			const sidebar = document.getElementById("sidebar");
			if (sidebar.style.width === "250px") {
				sidebar.style.width = "0";
			} else {
				sidebar.style.width = "250px";
			}
		}

