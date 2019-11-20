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

    renderMenu(response.menu)


  })

});

$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((response) => {

    console.log(response.rows);
    response.rows;
  })
});

const createOrder = function (order) {
  return (`
    <tr>
      <td>${order.name}</td>
      <td>${order.quantity}</td>
      <td>${order.price*order.quantity}</td>
    </tr>
  `)
}

const getLastOrder = function (menu_orders) {
  let max = 0;
  for (let item in menu_orders) {
    if (menu_orders[item]['order_id'] > max) {
      max = menu_orders[item]['order_id'];
    }
  }
  return max
}

// const renderOrder = function (orders) {
//   $("#order-summary-container").append(`
//     <div class="card">
//       <div class="card-header">
//         Your order
//       </div>
//     <div class="order-summary">
//        <div>Dish name</div>
//        <div>Quantity</div>
//        <div>Price</div>
//     </div>
//     `);
//   const menuContainer = $('.order-summary');
//   orders.forEach((order) => {
//     if (order.order_id == getLastOrder(orders)) {
//       menuContainer.append(createOrder(order))
//     }
//   })
// }

const getTotalPrice = function (menu_orders) {
  let total = 0
  for (let item of menu_orders) {
    if (order.order_id == getLastOrder(orders)) {
      total += menu_orders[item]['price']
    }
  }
  return total * 1.05;
}
const getTotalTax = function (menu_orders) {
  let total = 0
  for (let item of menu_orders) {
    if (order.order_id == getLastOrder(orders)) {
      total += menu_orders[item]['price']
    }
  }
  return total * 0.05;
}
//console.log('Total price ', getTotalPrice(menu_orders))

const renderOrder = function (orders) {
  $("#order-summary-container").append(`
    <table style="width:100%" class="table table-hover">
    <thead>
    <tr>
      <th>Your order</th>
      <th class='time-ready'></th>
    </tr>
    <tr>
      <th>Dish name</th>
      <th>Quantity</th>
      <th>Price</th>
    </tr>
    </thead>
    <tbody class='order-table-body'>
    </tbody>

    </table>
    `);
  const menuContainer = $('.order-table-body');
  let totalPrice = 0;
  let totalTax = 0;
  let orderStatus = 0;

  orders.forEach((order) => {
    if (order.order_id == getLastOrder(orders)) {
      if (order.quantity > 0) {
        totalPrice += order.price * order.quantity;
        orderStatus = order.order_status;
      }
      menuContainer.append(createOrder(order))
    }
  })

  totalTax = 0.05 * totalPrice;
  totalPrice += totalTax;

  // $('.order-table-body').append(
  //   `
  //     <tr>
  //     <td class='orderStatus'><strong>Order ready in ${orderStatus}<strong></td>
  //     <td>Tax:$${totalTax}</td>
  //     <td>$${totalPrice}</td>
  //     </tr>
  //   `
  // )

  if (orderStatus) {
    $('.order-table-body').append(
      `
        <tr>
        <td class='orderStatus'><strong>Order ready in ${orderStatus}<strong></td>
        <td>Tax:$${totalTax}</td>
        <td>$${totalPrice}</td>
        </tr>
      `
    )
  } else {
    $('.order-table-body').append(
      `
        <tr>
        <td class='orderStatus'><strong>We are working on your order<strong></td>
        <td>Tax:$${totalTax}</td>
        <td>$${totalPrice}</td>
        </tr>
      `
    )
  }
}

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

    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: "/api/orders",
      data: {
        userOrder: output
      }
    }).then((response) => {

      $.ajax({
        method: "GET",
        url: "/api/menu_orders"
      }).done((response) => {
        console.log('RESPONSE ', response)

        // $.ajax({
        //   method: 'POST',
        //   url: "/sms",
        //   data: {
        //     response: response.menu_orders[0]
        //   }
        // })

        localStorage.setItem("isOrdered", "true");

        //console.log(response.menu_orders);
        $("#menu-items").slideUp('slow')

        renderOrder(response.menu_orders);
        $("#order-button").hide();
      });

    })
    usersInput();

  })

});

$(() => {
  if (localStorage.getItem("isOrdered") === "true") {
    $("#menu-items").hide()
    $("#order-button").hide();
    $.ajax({
      method: "GET",
      url: "/api/menu_orders"
    }).done((response) => {

      renderOrder(response.menu_orders);
    })
  }

  $("#logout").click(function () {
    localStorage.removeItem('isOrdered');
  })

});
