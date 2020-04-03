// Эта функция по идее должна быть импортирована,
// но упрощено и нужно её простейшим образом реализовать
const serverApiRequest = async (queryString) => {
  /*simulate request*/
  const url = "//t.syshub.ru"
  try {
    const res = await fetch(url + queryString);
    return await res.json()
  } catch (err) {
    return err.message
  }
};

// Можно выполнить по аналогии с serverApiRequest(), а можно лучше, см. подсказку ниже
const sendAnalytics = async (queryString, data) => {
  /*sendBeacon maybe*/
  const url = "//t.syshub.ru"

  // Проблемное место для отправки данных на сервер: CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. 
  try {
    const response = await fetch(url + queryString, {
      method: 'POST',
      body: { "data": [data] }
    });
  } catch (err) {
    return err.message
  }
};

/* Нужно:
    1 Сделать функцию рабочей в принципе не меняя логики но доступно ES8+
    2 Общая логика: запрос, если успех, то отправка данных в аналитику, обработка данных и их возврат
    3 Подсветить места, где ТЗ недостаточно
    4 Подсветить места, вероятно проблемные
*/
const requestData = async ({ id, param }) => {
  // should return [null, {v: 1}, {v: 4}, null] or Error (may return array (null | {v: number})[])
  try {
    const requestData = await serverApiRequest("/query/data/" + id + "/param/" + param);

    // after complete request if *not* Error call
    sendAnalytics("/requestDone", {
      type: "data",
      id: id,
      param: param
    });

    // Проблемное место для фильтрации чисел если придет не массив  
    // магия, описать 
    const filterData = requestData.filter(item => item).map(obj => obj.v)
    return filterData
  }
  catch (err) {
    return err.message
  }
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
  log(await requestData({ id: 4, param: 404 }));
})();
// END DO NOT EDIT app

