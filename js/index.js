const table = new Table("viewer");

const getMockData = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users/1");
  return response.json();
};

getMockData().then((data) => table.createTable(data));
