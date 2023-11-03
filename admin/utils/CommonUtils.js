import * as XLSX from 'xlsx/xlsx.js';
const downloadExcel = () => {
    console.log(XLSX);
    const worksheet = XLSX.utils.json_to_sheet(excelExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'kelvin');
    //buffer
    let buf = XLSX.write(workbook, { booktype: 'xlsx', type: 'buffer' });
    //binary string
    XLSX.write(workbook, { booktype: 'xlsx', type: 'binary' });
    //download
    XLSX.writeFile(workbook, 'kelvin.xlsx');
};

