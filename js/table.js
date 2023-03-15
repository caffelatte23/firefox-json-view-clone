class Table {
  tableRef = null;

  constructor(id) {
    this.tableRef = document.getElementById(id)
  }

  #createRow (row, { name=null, level=1 }){
    const valueType = typeof row[1]
    const trName = name ?? row[0]
    const tableRow = new TableRow(valueType, level, trName)
    this.tableRef.appendChild(tableRow.make(...row))
  
    if(valueType === "object") {
      Object.entries(row[1]).forEach((d) => 
        this.#createRow(d, { name: `${trName}/${d[0]}`,  level: level + 1})
      )
    }
  }
  
  createTable(data) {
    Object.entries(data).forEach((row) => 
      this.#createRow(row, { name: null, level: 1 })
    )
  }
}