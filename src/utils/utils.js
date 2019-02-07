/* eslint-disable prettier/prettier */
import * as XLSX from 'xlsx';

export const replaceAll=(str,search,replacement)=>{
    return str.replace(new RegExp(search,'g'),replacement);
};
export const getSmsNo =charno =>{
    let no=parseInt(charno/160,10);
    return ++no;
};

export function* customSmsParser(str,delimiter1,delimiter2){
    //generator function get all occurences of string between delimiter 1 & 2
    let indices=[];
    for(let i=0;i<str.length;++i){
        if(str[i]===delimiter1){
            indices.push(i);
        }else if(str[i]===delimiter2){
            let idx=indices.pop();
            yield str.slice(idx+1,i);
            yield str.slice(idx,i+1);
        }
    }
}

export function* interPlace(arr,delimiter){
    //generator function to place a character after each element of an array
    let first=true;
    for(const x of arr){
        if(!first) yield delimiter;
        first=false;
        yield x;
    }
}

export function checkFileValidity(f,allColumns){
    let itsok=false;
    if(!f.headers.includes("TELEPHONE")){
        alert("Votre fichier ne contient aucune colonne TELEPHONE .\n Modifiez le et réessayez.");
        itsok=false;
    }else if(!allColumns.length){
        itsok=window.confirm("Votre sms ne contient pas de colonnes pour effectuer des envois dynamiques.\nVoulez vous tout de même procéder aux envois ?");
    }else{
        for(let i=0;i<allColumns.length;i++){
            if(!f.headers.includes(allColumns[i])){
                alert("Votre fichier ne contient pas de colonne "+allColumns[i]);
                return false;
            }
        }
        return true;
    }
    return itsok;
}

export function generateSmsTable(dataXl,state){
    //construit les sms a envoyer
    const {message,delimiters}=state;
    let res=[];
    dataXl.data.forEach(e => {
        let sms=replaceAll(message,delimiters.first,"");
        sms=replaceAll(sms,delimiters.last,"");
        for(let i=0;i<dataXl.headers.length;i++){
            if(dataXl.headers[i]!=="TELEPHONE"){
                sms=sms.replace(dataXl.headers[i],e[`${dataXl.headers[i]}`]);
            }
        }

        res.push({sms,number:e.TELEPHONE});
    });

    return res;
}

export  function processXlFile(f){
    //the module sheetjs xlsx est necessaire pour faire foncionner cette fonction qui lit un fichier
  return new Promise((resolve,reject)=>{
    let name=f.name;
    const reader=new FileReader();
    console.log("in excel function");

    reader.onload=(e)=>{
        const binaryStr=e.target.result;
        const workbook=XLSX.read(binaryStr,{type:'binary'});//get workbook from file
        //get first worksheet
        const wsname=workbook.SheetNames[0];
        const ws=workbook.Sheets[wsname];
        //check if columns match with file columns
        //--1 get all columns of uploaded file
        const header=getHeaders(ws);
        console.log(`all columns of the file ${name} are:\n${[...interPlace(header,'\n')]}`);
        //convert in array of arrays
        const data=XLSX.utils.sheet_to_json(ws);
       const result={headers:header,data};
       resolve(result);
        //console.log("Data in xls file>>>"+data);
    };
    reader.onerror=(e)=>{
        reject(e);
    }
    reader.readAsBinaryString(f);
  });
}

function getHeaders(sheet){
    let headers=[];
    let hdr;
    let range=XLSX.utils.decode_range(sheet['!ref']);
    let C,R=range.s.r;//la premiere ligne
    for(C=range.s.c;C<=range.e.c;++C){
        let cell=sheet[XLSX.utils.encode_cell({c:C,r:R})];//trouve la cellule dans la premiere ligne
        //let hdr="NON DEFINI voir colonne "+C;//valeur par defaut
        if(cell&&cell.t){
            hdr=XLSX.utils.format_cell(cell);
            headers.push(hdr);
        }
        
    }
    return headers;
}