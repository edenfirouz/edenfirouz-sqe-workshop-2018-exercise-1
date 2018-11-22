import * as esprima from 'esprima';

let table = [];
let index = 0;
let line = 0;
let lineInTable = {};

const parseCode = (codeToParse) => {
    return esprima.parseScript(codeToParse);
};

const returnStatement=(code)=>{
    lineInTable.Line = line;  //Line
    lineInTable.Type='Return Statement'; //Type
    lineInTable.Value=value(code.argument);
    table[index] = lineInTable;
    index++;
};
const value=(code)=>{
    if (code.type=='Identifier'){
        return code.name;
    }
    else if(code.type=='Literal'){
        return code.value;
    }
    else if(code.type=='UnaryExpression'){
        return code.operator+value(code.argument);
    }
    else if(code.type=='ArrayExpression'){
        return arrayExpression(code.elements);
    }
    else return binaryExpression(code);
};
const arrayExpression=(code)=>{
    let arr='[';
    for (let i = 0; i < code.length; i++) {
        if(i!=0)
            arr=arr+' , ';
        arr=arr+ value(code[i]);
    }
    return arr+']';
};
const binaryExpression=(code)=> {
    let operator= code.operator;
    let left=BExpression(code.left);
    let right=BExpression(code.right);
    return left+operator+right;
};
const BExpression=(code)=>{
    if (code.type=='BinaryExpression' ){
        return '('+binaryExpression(code)+')';
    }
    else if(code.type=='MemberExpression'){
        return memberExpression(code);
    }
    else if (code.type=='Identifier'){
        return code.name;
    }
    else  { //if (code.type=='Literal')
        return code.value;
    }
};
const memberExpression=(code)=>{
    let object =value(code.object);
    let property=value(code.property);
    return object + '[' + property + ']';
};
const whichType=(code)=>{
    if(code.type=='BinaryExpression' || code.type=='AssignmentExpression'){
        return binaryExpression(code);
    }
    else if(code.type=='UpdateExpression'){
        return updateExpression(code);
    }
    else //if(code.type=='VariableDeclaration')
        return code.kind+' '+code.declarations[0].id.name+'='+value(code.declarations[0].init);
};
const ifStatement=(code)=> {
    lineInTable.Line = line;  //Line
    lineInTable.Type='If Statement'; //Type
    lineInTable.Condition = value(code.test); //Condition
    table[index] = lineInTable;
    index++;
    if (code.consequent.type != 'undefined' && code.consequent.type =='BlockStatement'){
        recCreateTable(code.consequent);
    }
    else
        enterToArr(code.consequent);
    alternateInIf(code);
};
const alternateInIf=(code)=>{
    if(!(code.alternate==null) && (code.alternate != 'undefined')){
        if(!(code.alternate.alternate)) {
            elseStatement();
        }
        enterToArr(code.alternate);
    }
};
const forStatement=(code)=>{
    lineInTable.Line = line;  //Line
    lineInTable.Type='For Statement'; //Type
    let init=whichType(code.init);
    let test=whichType(code.test);
    let update=whichType(code.update);
    lineInTable.Condition = init+' ; '+test+' ; '+update; //Condition
    table[index] = lineInTable;
    index++;
};
const elseStatement=()=>{
    line++;
    lineInTable = {
        Line: '',
        Type: '',
        Name: '',
        Condition: '',
        Value: ''
    };
    lineInTable.Line = line;  //Line
    lineInTable.Type='Else Statement'; //Type
    table[index] = lineInTable;
    index++;
};
const enterToArr=(code)=>{
    let codeInArr=[];
    codeInArr[0]=code;
    recCreateTable(codeInArr);
};
const whileStatement=(code)=> {
    lineInTable.Line = line; //Line
    lineInTable.Type='While Statement';  //Type
    lineInTable.Condition = value(code.test); //Condition
    table[index] = lineInTable;
    index++;
};
const expressionStatement=(code)=> {
    lineInTable.Line = line; //Line
    if (code.expression.type == 'AssignmentExpression') {
        assignmentExpression(code.expression);
    }
    else {
        lineInTable.Type = 'Update Expression'; //Type
        lineInTable.Name=value(code.expression.argument); //Name
        lineInTable.Value=updateExpression(code.expression);
    }
    table[index] = lineInTable;
    index++;
};
const updateExpression=(code)=>{
    return value(code.argument)+code.operator; //Value
};
const assignmentExpression=(code)=> {
    lineInTable.Type = 'Assignment Expression'; //Type
    if(code.left.type=='MemberExpression'){
        lineInTable.Name=memberExpression(code.left);
    }
    else
        lineInTable.Name = code.left.name; //Name
    if (code.right.type == 'BinaryExpression') {
        lineInTable.Value = binaryExpression(code.right);
    }
    else
        lineInTable.Value = code.right.value; //Value
    // table[index] = lineInTable;
    // index++;
};
const variableDeclaration=(code)=>{
    for (let j = 0; j < code.declarations.length; j++) {
        lineInTable = {
            Line: '',
            Type: '',
            Name: '',
            Condition: '',
            Value: ''
        };
        lineInTable.Line = line; //Line
        lineInTable.Type = 'Variable Declaration'; //Type
        lineInTable.Name = code.declarations[j].id.name; //Name
        if(code.declarations[j].init!=null){
            lineInTable.Value = value(code.declarations[j].init); //Value
        }
        table[index] = lineInTable;
        index++;
    }
};
const functionDeclaration=(code)=> {
    lineInTable.Line = line; //Line
    lineInTable.Type = 'Function Declaration'; //Type
    lineInTable.Name = code.id.name; //Name
    table[index] = lineInTable;
    index++;
    if (code.params.length > 0) {
        for (let j = 0; j < code.params.length; j++) {
            lineInTable = {Line: '', Type: '', Name: '', Condition: '', Value: ''};
            lineInTable.Line = line; //Line
            lineInTable.Type = 'Variable Declaration'; //Type
            lineInTable.Name = code.params[j].name; //Name
            table[index] = lineInTable;
            index++;
        }
    }
};

const fillTable=(arrayTable)=>{
    let tableString='';
    tableString='<table border="1"><tr><td> Line </td><td> Type </td><td> Name </td><td> Condition </td><td> Value </td></tr>';
    arrayTable.forEach(function(element) {
        tableString+='<tr><td>'+element.Line+'</td><td>'+ element.Type+'</td><td>'+element.Name+'</td><td>'+element.Condition.replace('<','&lt')+'</td><td>'+element.Value+'</td></tr>';
    });
    tableString+='</table>';
    return tableString;
};

const recCreateTable=(code)=> {
    if ((code.body != 'undefined') && (code.type=='BlockStatement')) {
        recCreateTable(code.body);
    }
    else{
        for (let i = 0; i < code.length; i++) {
            line++;
            lineInTable = {
                Line: '',
                Type: '',
                Name: '',
                Condition: '',
                Value: ''
            };
            checkType(code[i]);
        }
    }
};
const checkType=(code)=>{
    if (code.type == 'FunctionDeclaration') {
        functionDeclaration(code);
        recCreateTable(code.body);
    }
    else if(code.type=='VariableDeclaration'){
        variableDeclaration(code);
    }
    else
        statementType(code);
};

const statementType=(code)=>{
    if(code.type=='ExpressionStatement'){
        expressionStatement(code);
    }
    else if(code.type=='IfStatement'){
        ifStatement(code);
    }
    else if(code.type=='ReturnStatement'){
        returnStatement(code);
    }
    else
        loopStatement(code);
};
const loopStatement=(code)=>{
    if(code.type=='WhileStatement'){
        whileStatement(code);
        recCreateTable(code.body);

    }
    else {//(code.type=='ForStatement')
        forStatement(code);
        recCreateTable(code.body);
    }
};

const createTable=(code)=>{
    table=[];
    index = 0;
    line = 0;
    recCreateTable(code.body);
    return fillTable(table);
};

export {createTable};
export {parseCode};
