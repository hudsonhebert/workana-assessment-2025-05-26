var dynamic_values = {
  F1_Background_img: "assets/images/F1_Background_img.png",
  F1_Background_img_check: "assets/images/F1_Background_img_check.png",
  Carousel_Background_img: "assets/images/Carousel_Background_img.png",
  Tile1_1_img: "assets/images/Tile1_1_img.png",
  Tile1_2_img: "assets/images/Tile1_2_img.png",
  Tile2_1_img: "assets/images/Tile2_1_img.png",
  Tile2_2_img: "assets/images/Tile2_2_img.png",
  Tile3_1_img: "assets/images/Tile3_1_img.png",
  Tile3_2_img: "assets/images/Tile3_2_img.png",
  Tile4_1_img: "assets/images/Tile4_1_img.png",
  Tile4_2_img: "assets/images/Tile4_2_img.png",
  Carousel_Tile1_background_img: "assets/images/Carousel_Background_Tile1.png",
  Carousel_Tile2_background_img: "assets/images/Carousel_Background_Tile2.png",
  Carousel_Tile3_background_img: "assets/images/Carousel_Background_Tile3.png",
  Carousel_Tile4_background_img: "assets/images/Carousel_Background_Tile4.png",
  Data_URL: "https://fm.flashtalking.com/feed/591/hybrid/trending_events"
};

/* control ad state */

var adState = {
  loaded: false,
  firstAnimatedTiles: true,
  tilesChanged: false,
  tileInterval: null,
  tilesIntCount: 0,
  loopanimation: false,
  tileClicked: 1,
  tilesCat: ["womens", "bedbath", "beauty", "other"]
}

/* create main elements */

const container = document.createElement("div");
container.id = "ad-container";
container.style.display = "none";
document.body.appendChild(container);

const mainFrame = document.createElement("div");
mainFrame.id = "main-frame";
container.appendChild(mainFrame);

const checkImg = document.createElement("div");
checkImg.id = "check-img";
checkImg.style.backgroundImage = "url(assets/images/F1_Background_img_check.png)";
checkImg.style.display = "none";
mainFrame.appendChild(checkImg);

const carousel = document.createElement("div");
carousel.id = "carousel";
container.appendChild(carousel);

const carouselTile1 = document.createElement("div");
carouselTile1.id = "carouselTile1";
carouselTile1.classList.add("carouselTile1");
carouselTile1.style.backgroundImage = "url(assets/images/Carousel_Background_Tile1.png)";
carousel.appendChild(carouselTile1);

const carouselTile2 = document.createElement("div");
carouselTile2.id = "carouselTile2";
carouselTile2.classList.add("carouselTile2");
carouselTile2.style.backgroundImage = "url(assets/images/Carousel_Background_Tile2.png)";
carousel.appendChild(carouselTile2);

const carouselTile3 = document.createElement("div");
carouselTile3.id = "carouselTile3";
carouselTile3.classList.add("carouselTile3");
carouselTile3.style.backgroundImage = "url(assets/images/Carousel_Background_Tile3.png)";
carousel.appendChild(carouselTile3);

const carouselTile4 = document.createElement("div");
carouselTile4.id = "carouselTile4";
carouselTile4.classList.add("carouselTile4");
carouselTile4.style.backgroundImage = "url(assets/images/Carousel_Background_Tile4.png)";
carousel.appendChild(carouselTile4);

const products = document.createElement("div");
products.id = "product-list";
carousel.appendChild(products);

const backBtn = document.createElement("div");
backBtn.id = "back-btn";
carousel.appendChild(backBtn);

/* preload base images */

const imageUrls = Object.values(dynamic_values).filter((url) =>
  url.endsWith(".png")
);

let loadedCount = 0;

const onImageLoad = () => {
  loadedCount++;
  if (loadedCount === imageUrls.length) {
    adState.loaded = true;
    document.getElementById("ad-container").style.display = "block";
    mountApp();
  }
};

const onImageError = (url) => {
  console.error("Error loading image:", url);
  onImageLoad(); // skips even if image loading fails
};

imageUrls.forEach((url) => {
  const img = new Image();
  img.onload = onImageLoad;
  img.onerror = () => onImageError(url);
  img.src = url;
});

/* functions */

function mountApp() {
  loadFeed();
  const tiles = [1, 2, 3, 4];

  tiles.forEach((i) => {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    tile.id = "tile" + i;
    tile.style.backgroundImage = `url(assets/images/Tile${i}_1_img.png)`;
    mainFrame.appendChild(tile);

    tile.addEventListener("click", (event) => {
      const elementId = event.target.id;
      adState.tileClicked = elementId.replace("tile", "");
      if (adState.loaded && !adState.firstAnimatedTiles) {
        stopTileAnimation();
        // change to carousel page
        document.getElementById("carousel").classList.add('visible');
        document.getElementById("carouselTile" + adState.tileClicked).style.display = "block";
        const elements = document.getElementsByClassName("product");
        for (let i = 0; i < elements.length; i++) {
          if (elements[i].classList.contains(adState.tilesCat[adState.tileClicked - 1])) {
            elements[i].style.display = "block";
          } else {
            elements[i].style.display = "none";
          }
        }
        setTimeout(function(){
          resetTiles();
        }, 600);

        // reset tiles
        adState.tilesChanged = false;
        adState.tilesIntCount = 0;
        resetTiles();
      }
    });
  });

  // start first animation
  animateTilesFirstTime();
}

function animateTilesFirstTime() {
  adState.firstAnimatedTiles = true;
  adState.tilesIntCount = 0;

  function animateNextTile() {
    if (adState.tilesIntCount >= 4) {
      adState.tilesIntCount = 0;
      adState.firstAnimatedTiles = false;

      // change to carousel page
      document.getElementById("carousel").classList.add('visible');
      document.getElementById("carouselTile" + adState.tileClicked).style.display = "block";
      const elements = document.getElementsByClassName("product");
      for (let i = 0; i < elements.length; i++) {
        if (elements[i].classList.contains(adState.tilesCat[adState.tileClicked - 1])) {
          elements[i].style.display = "block";
        } else {
          elements[i].style.display = "none";
        }
      }
      setTimeout(function(){
        resetTiles();
      }, 600);

      return;
    }

    adState.tilesIntCount++;
    const i = adState.tilesIntCount;
    document.getElementById("tile" + i).style.backgroundImage = `url(assets/images/Tile${i}_2_img.png)`;

    setTimeout(animateNextTile, 1500);
  }

  // start tiles animation
  if (adState.firstAnimatedTiles) {
    // first time animation
    setTimeout(() => {
      document.getElementById("check-img").style.display = "block";

      setTimeout(() => {
        animateNextTile();
      }, 1500);
    }, 1500);
  }
  else {
    animateNextTile();
  }
}

function animateTilesLoop() {
  adState.loopAnimation = true;
  adState.tilesIntCount = 1;
  adState.tilesChanged = false;

  adState.tileInterval = setInterval(() => {
    if (!adState.loopAnimation) return;

    const i = adState.tilesIntCount;

    document.getElementById("tile" + i).style.backgroundImage = `url(assets/images/Tile${i}_${adState.tilesChanged ? "1" : "2"}_img.png)`;

    adState.tilesIntCount++;
    if (adState.tilesIntCount > 4) {
      adState.tilesIntCount = 1;
      adState.tilesChanged = !adState.tilesChanged;
    }

  }, 1500);
}

function stopTileAnimation() {
  adState.loopAnimation = false;
  clearInterval(adState.tileInterval);
  adState.tilesIntCount = 0;
  resetTiles();
}

function resetTiles() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById("tile" + i).style.backgroundImage = `url(assets/images/Tile${i}_1_img.png)`;
  }
}

document.getElementById("back-btn").addEventListener("click", () => {
  adState.carouselVisible = false;
  document.getElementById("carousel").classList.remove('visible');
  setTimeout(function(){
    document.getElementById("carouselTile" + adState.tileClicked).style.display = "none";
    resetTiles();
    animateTilesLoop();
  }, 600);
});

function loadFeed() {
  let proxy_URL = "https://corsproxy.io/?url=" + dynamic_values.Data_URL;
  fetch(proxy_URL)
    .then((res) => {
      if (!res.ok) throw new Error("Error loading proxy.");
      return res.json();
    })
    .then((data) => {
      const list = document.getElementById("product-list");
      list.innerHTML = "";
      const container = document.createElement("div");
      container.classList.add("container");
      list.appendChild(container);

      data.forEach((product) => {
        const div = document.createElement("div");
        div.classList.add("product");
        div.classList.add(product.inapp_category);
        div.innerHTML = `
          <img src="${product.additional_image_link}" alt="${product.title}" >
          <div class="price">$${product.price.replace(" USD", "")}<div>
        `;
        if (product.sale_price.indexOf("USD") > -1) {
          div.innerHTML += `<div class="sale_price">Reg <span>${product.sale_price.replace(" USD", "")}</span><div>`
        }
        div.innerHTML += `<div class="title">${product.title}</div>`;
        container.appendChild(div);
      });
    })
    .catch((err) => {
      console.error(err);
      document.getElementById("product-list").innerHTML = `<div class="error">Error loading products.</div>`;
    });
}
