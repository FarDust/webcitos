baseColor = document.body.style['background-color'];
let open = false;

function openNav() {
  if ($(window).width() > 600) {
    document.getElementById('lateral-menu').style.width = '170px';
    document.getElementById('main').style['margin-left'] = '170px';
  } else {
    document.getElementById('lateral-menu').style.width = '75%';
    document.getElementById('right-arrow').style['margin-left'] = '75%';
    document.getElementById('main').style['margin-left'] = '75%';
    if (open == true) {
      closeNav();
      return;
    }
    open = true;
  }
  // document.body.style['background-color'] = "black";
  // document.body.style['opacity'] = "0.5";
}

function closeNav() {
  document.getElementById('lateral-menu').style.width = '0%';
  document.getElementById('right-arrow').style['margin-left'] = '0';
  document.getElementById('main').style['margin-left'] = '0';
  // document.body.style['background-color'] = baseColor;
  // document.body.style['opacity'] = "1";
  open = false;
}
