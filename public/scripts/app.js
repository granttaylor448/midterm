// $(() => {
// $.ajax({
// method: "GET",
// url: "/api/users"
// }).done((users) => {
// for (user of users) {
// $("<div>").text(user.name).appendTo($("body"));
// }
// });;
// });

const createMenu = function (menu) {
  return (
    ` <article class="card menu-items__card p-3 mb-3">

        <div class="card-header menu-title-price">

        <div class="menu-title" value="${menu.id}">
       ${menu.name}
        </div>

          <div class="menu-price">
            <h5>${menu.price}</h5>
          </div>

        </div>

        <div class="menu-items__flex">
          <img class="menu-image inline" src="${menu.photo}" alt="fried_rice">
          <div class="card-body inline">
            <p class="card-text text-justify">
            ${menu.description}
            </p>
          </div>

          <div id='qty' class="qty">
            <span class="minus bg-danger">-</span>
            <input type="number" class="count" name="qty" value="0" min='0' max='10'>
            <span class="plus bg-danger">+</span>
          </div>
        </div>
      </article>`
  )
}

const renderMenu = function (menuElements) {
  const menuContainer = $('#menu-items');
  menuElements.forEach((menu) => {
    menuContainer.append(createMenu(menu))
  })
}

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/menu"
  }).done((response) => {
    //console.log(response.menu);
    renderMenu(response.menu);
  })

});

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((response) => {
    //console.log(response.menu);
    console.log(response.rows);
    response.rows;
  })

});

const createOrder = function (order) {
  return (`
      <div class="card-body order-summary">
        <h4 class="card-title">${order.menu_id}</h4>
        <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
        <a href="#" class="btn btn-primary">Go somewhere</a>
      </div>
  `)
}

const renderOrder = function (orders) {
  $("#order-summary-container").append(`
    <div class="card">
      <div class="card-header">
        Your order
      </div>
    <div class="card-body order-summary">
    `);
  const menuContainer = $('.order-summary');
  orders.forEach((order) => {
    if (order.order_id == 1) {
      menuContainer.append(createOrder(order))
    }
  })
}
//console.log('COOKIE ', req.session.cookie)
$(() => {
  function usersInput() {
    let usersOrder = [];
    let menuId = document.getElementsByClassName('menu-title');
    let elements = document.getElementsByClassName("count");

    for (var i = 0; i < elements.length; i++) {
      if (Number(elements[i].value) >= 1) {
        usersOrder.push([Number(elements[i].value), Number(menuId[i].getAttribute('value'))])
      }
    }
    //console.log('usersOrder ', usersOrder);
    return usersOrder;
  }


  $("#order-button").click(function (e) {

    let output = JSON.stringify(usersInput());
    console.log('output ', output)
    // let countVal = $('.count').val();
    // console.log('countVal ', countVal);
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: "/api/orders",
      data: {
        userOrder: output
      }
    }).done((response) => {
      //console.log(response.menu);
      console.log('response ', response);
    })
    usersInput();

    $.ajax({
      method: "GET",
      url: "/api/menu_orders"
    }).done((response) => {
      //console.log(response.menu);
      $("#menu-items").slideUp('slow')
      renderOrder(response.menu_orders);
    })
  })

});
