// Эта функция по идее должна быть импортирована,
// но упрощено и нужно её простейшим образом реализовать
async function serverApiRequest(a) {
  /*simulate request*/
  const url = "//t.syshub.ru"
  try {
    const res = await fetch(url + a);
    return await res.json()
  } catch (err) {
    console.log(
      "There has been a problem with your fetch operation",
      err.message
    )
  }
};

// Можно выполнить по аналогии с serverApiRequest(), а можно лучше, см. подсказку ниже
async function sendAnalytics(a, b) {
  /*sendBeacon maybe*/
  const url = "//t.syshub.ru"
  try {
    const response = await fetch(url + a, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body:  {"data":[b]}
    });
    const content = await response.json();
    return content
  } catch (err) {
    alert(
      "There has been a problem with your fetch operation",
      err.message
    )
  }
};

/* Нужно:
    1 Сделать функцию рабочей в принципе не меняя логики но доступно ES8+
    2 Общая логика: запрос, если успех, то отправка данных в аналитику, обработка данных и их возврат
    3 Подсветить места, где ТЗ недостаточно
    4 Подсветить места, вероятно проблемные
*/
const requestData = ({ id, param }) => {
  // should return [null, {v: 1}, {v: 4}, null] or Error (may return array (null | {v: number})[])
  var array = serverApiRequest("/query/data/" + id + "/param/" + param);

  // after complete request if *not* Error call
  sendAnalytics("/requestDone", {
    type: "data",
    id: id,
    param: param
  });

  // магия, описать
  return array; // return [1, 4]
};

// app proto
// START DO NOT EDIT app
(async () => {
  const log = text => {
    const app = document.querySelector("#app");
    app.appendChild(document.createTextNode(JSON.stringify(text, null, 2)));
    app.appendChild(document.createElement("br"));
  };

  log(await requestData({ id: 1, param: "any" }));
  log(await requestData({ id: 4, param: "string" }));
  log(await requestData({ id: 4, param: "any" }));
})();
// END DO NOT EDIT app

