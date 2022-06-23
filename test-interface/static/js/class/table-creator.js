export class TableCreator {
  constructor (
    tableContainer = Node(),
    addTableButtonEvent = Function() || null,
    tableColumnList = [{
      name: String(), 
      key: String(),
      width: String(),
      formatFunction: Function() || undefined,
      formatPrameterKeyList: Array(String()) || undefined,
    }],
    widthUnit = String() // 'rem', 'px'
  ) {
    this.tableContainer = tableContainer;
    this.addTableButtonEvent = addTableButtonEvent;
    this.tableColumnList = tableColumnList;
    this.widthUnit = widthUnit;
  }

  convertData = (data) => {
    this.tableContainer.innerHTML = '';
    const tableColumnList = this.tableColumnList;
    const widthUnit = this.widthUnit;

    const tableHeader = (() => {
      const tableRow = document.createElement('tr');
      tableColumnList.forEach(column => {
        const th = document.createElement('th');
        th.style.width = column.width + this.widthUnit;
        th.innerHTML = column.name;
  
        tableRow.appendChild(th);
      });
      const tableHeader = document.createElement('thead');
      tableHeader.appendChild(tableRow);

      return tableHeader;
    })();

    const tableBody = (() => {
      const tableBody = document.createElement('tbody');

      const rowQuantity = data.length;
      if (rowQuantity === 0) {
        const tableRow = document.createElement('tr');
  
        const td = document.createElement('td');
        let fullWidth = 0;
        tableColumnList.forEach(column => {
          fullWidth += column.width;
        });
        td.style.width = fullWidth + widthUnit;
        td.style.textAlign = 'center';
        td.innerHTML = 'NO DATA MATCHES THE FILTER CONDITION ~';
  
        tableRow.appendChild(td);
        tableBody.appendChild(tableRow);
  
      } else if (rowQuantity > 0) {
        (function changeDataWithFormat() {
          data.forEach((row) => {
            tableColumnList.forEach((column) => {
              if (
                column.formatFunction !== undefined &&
                column.formatPrameterKeyList.length === 1
              ) {
                const columnFormatKey = column.formatPrameterKeyList[0];
                const columnWithFormat =
                  column.formatFunction(row[columnFormatKey]);
    
                row[column.key] = columnWithFormat;
    
              } else if (
                column.formatFunction !== undefined &&
                column.formatPrameterKeyList.length > 1
              ) {
                const parameterList = [];
                column.formatPrameterKeyList.forEach((formatPrameterKey) => {
                  parameterList.push(row[formatPrameterKey]);
                });
    
                row[column.key] = column.formatFunction(parameterList);
              };
            });
          });
        })();
  
        (function addTableBodyData () {
          data.forEach(row => {
            const tableRow = document.createElement('tr');
    
            tableColumnList.forEach(column => {
              const td = document.createElement('td');
              td.style.width = column.width + widthUnit;
              td.innerHTML = row[column.key];
    
              tableRow.appendChild(td);
            });
    
            tableBody.appendChild(tableRow);
          });
        })();
      };

      return tableBody;
    })();

    this.tableContainer.appendChild(tableHeader);
    this.tableContainer.appendChild(tableBody);

    if (this.addTableButtonEvent !== null) {
      this.addTableButtonEvent();
    };

    // console.log(data);
  }
};