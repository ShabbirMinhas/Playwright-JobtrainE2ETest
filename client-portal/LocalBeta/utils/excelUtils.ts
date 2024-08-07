/**
 * File: excelUtils.ts
 * Author: Shabbir Minhas
 * Date: May 20, 2024
 * 
 * Description:
 * This file defines the ExcelUtils class, which provides utility functions for reading and writing data to existing Excel files using the ExcelJS library.
 * The ExcelUtils class encapsulates all interactions related to Excel file operations, including writing data to an existing file and reading data from an existing file.
 * 
 * Classes:
 *   ExcelUtils:
 *     Description: Provides utility functions for reading and writing data to Excel files.
 *     Author: Shabbir Minhas
 * 
 * Usage:
 * import ExcelUtils from "../utils/excelUtils";
 * 
 */


//  Import the ExcelJS library
import ExcelJS from 'exceljs';

// Interface for defining the structure of a row in the Excel file
export interface ExcelRow {
    [key: string]: any;
}

export interface WriteOptions {
    // Optional array specifying which columns should be written to the Excel file.
    // If not provided, all columns will be written.
    columns?: string[];

    // Optional object specifying values to be written for the specified columns.
    // The keys should match the column names, and the values are the values to write in those columns.
    // If a value for a specified column is not provided, the original value from the data will be used.
    values?: { [key: string]: any };
}

/**
 * Utility functions for reading and writing data to Excel files.
 */
export default class ExcelUtils {
    /**
     * Reads data from an Excel file.
     * @param {string} filePath - The path to the Excel file.
     * @param {string} sheetName - The name of the worksheet to read data from.
     * @returns {Promise<ExcelRow[]>} An array of objects representing rows of data.
     */
    static async readData(filePath: string, sheetName: string): Promise<ExcelRow[]> {
        var workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filePath);

        // Get the specified worksheet
        const worksheet = workbook.getWorksheet(sheetName);

        // Check if the worksheet exists
        if (!worksheet) {
            throw new Error(`Worksheet "${sheetName}" not found in Excel file "${filePath}".`);
        }

        // Get the header row
        const headerRow = worksheet.getRow(1);

        // Check if the header row is null or empty
        if (!headerRow || headerRow.actualCellCount === 0) {
            throw new Error(`Header row not found or incomplete in worksheet "${sheetName}" of Excel file "${filePath}".`);
        }

        const data: ExcelRow[] = [];
        worksheet.eachRow((row, rowIndex) => {
            // Skip the header row
            if (rowIndex === 1) return;
            const rowData: ExcelRow = {};
            row.eachCell((cell, colNumber) => {
                // Get the corresponding header cell
                const headerCell = headerRow.getCell(colNumber);

                // Check if the header cell is null
                if (!headerCell) {
                    throw new Error(`Header cell for column ${colNumber} not found in worksheet "${sheetName}" of Excel file "${filePath}".`);
                }
                const headerCellValue = headerCell.value;
                if (headerCellValue) {
                    rowData[headerCellValue.toString()] = cell.value;
                }

            });
            data.push(rowData);
        });
        return data;
    }

    // Function to write data to an Excel file

    static async writeData(filePath: string, sheetName: string, data: ExcelRow[], options?: WriteOptions): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        // const worksheet = workbook.addWorksheet(sheetName);
        let worksheet: ExcelJS.Worksheet | undefined;
        try {
            // Try to read the existing file
            await workbook.xlsx.readFile(filePath);
            worksheet = workbook.getWorksheet(sheetName);

            // If the worksheet doesn't exist, throw an error
            if (!worksheet) {
                throw new Error(`Worksheet with name ${sheetName} does not exist.`);
            }
        } catch (error) {

            // Handle the error and provide a meaningful message
            if (error instanceof Error) {
                throw new Error(`Failed to read file or worksheet: ${error.message}`);
            } else {
                throw new Error('An unknown error occurred.');
            }
        }
        // Get existing headers from the worksheet
        const worksheetHeaders = worksheet.getRow(1).values as string[];
        // Ensure headers are valid (i.e., ignore the first cell which is undefined)
    const headers = worksheetHeaders.slice(1);
        // Assuming the first row contains headers
       // const headers = options?.columns || Object.keys(data[0]);

        data.forEach((row) => {
            const rowData = headers.map((header) => {
                // Check if options are provided and if this column should be written
                if (options && options.columns && options.columns.includes(header)) {
                    return options.values && options.values[header] !== undefined ? options.values[header] : row[header];
                } else {
                    return row[header];
                }
            });

            // Check if a row with the same identifier exists to update it (assuming 'id' is a unique identifier)
            const existingRow = worksheet?.findRow(row['id']);
            if (existingRow) {
                // Update the row with new data
                headers.forEach((header, index) => {
                    if(rowData[index]!==undefined){

                        existingRow.getCell(index + 1).value = rowData[index];
                    }
                   
                });
            } else {
                // If the row does not exist, add a new row with the provided data
                const newRow = worksheet?.addRow(rowData);
            }
        });

        await workbook.xlsx.writeFile(filePath);

    }

    //Function to write data in excel file using only columns 

    static async  writeDataWithColumns(filePath: string, sheetName: string, data?: ExcelRow[], options?: WriteOptions): Promise<void> {
        const workbook = new ExcelJS.Workbook();
        let worksheet: ExcelJS.Worksheet | undefined;
        try {
            await workbook.xlsx.readFile(filePath);
            worksheet = workbook.getWorksheet(sheetName);
    
            if (!worksheet) {
                throw new Error(`Worksheet with name ${sheetName} does not exist.`);
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to read file or worksheet: ${error.message}`);
            } else {
                throw new Error('An unknown error occurred.');
            }
        }
    
        const rowsToWrite: ExcelRow = data || options?.values || [];
        const headers = options?.columns || (rowsToWrite.length > 0 ? Object.keys(rowsToWrite[0]) : []);
    
        rowsToWrite.forEach((row:ExcelRow) => {
            const rowData = headers.map((header) => {
                return row[header] !== undefined ? row[header] : undefined;
            });
    
            const existingRow = worksheet?.findRow(row['id']);
            if (existingRow) {
                headers.forEach((header, index) => {
                    if (rowData[index] !== undefined) {
                        existingRow.getCell(index + 1).value = rowData[index];
                    }
                });
            } else {
                worksheet?.addRow(rowData);
            }
        });
    
        await workbook.xlsx.writeFile(filePath)
    }
    

}
