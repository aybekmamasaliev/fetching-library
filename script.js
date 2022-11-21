const errorStatuses = [500, 400, 404];
const bodyRequiredMethods = ["POST", "PATCH", "PUT"];

async function sendRequest(url, method, parameters, headers, format = "json") {
  console.log("running");
  let body = {};
  if (format === "json") {
    body = JSON.stringify(parameters);
  } else if (format === "formdata") {
    const fd = new FormData();
    for (const [key, value] in Object.entries(parameters)) {
      fd.append(key, value);
    }
    body = fd;
  }
  const isBodyRequired = bodyRequiredMethods.includes(method.toUpperCase());
  let options = { method, headers };
  if (isBodyRequired) {
    options = { ...options, body };
  }
  const res = await fetch(url, options);
  if (errorStatuses.includes(res.status)) {
    console.log('status found')
    switch (res.status) {
      case 400:
        throw new Error("Данные не верны");
      case 404:
        throw new Error("У Вас нету доступа на данный сервис");
      default:
        throw new Error("Произошла неизвестная ошибка");
    }
  } else return "Все прошло удачно";
}

async function getData() {
  try {
    const res = await sendRequest("https://jsonplaceholder.typicode.com/comments?postId=1", "POST", {}, {}, 'formdata');
    console.log(res);
  } catch (err) {
    console.log(err.message);
  }
}

getData();
