var jpdbBaseURL= 'http://api.login2explore.com:5577';
var jpdbIRL ='/api/irl';
var jpdbIML ='/api/iml';
var empDBName = 'Emp-DB';
var irlPartUrl='/api/irl';
var imlPartUrl ='/api/iml';
var empRelName = 'Emp-Data';
var connToken ="90937859|-31949271681795961|90953932";


setBaseUrl(jpdbBaseURL);
var baseUrl = "http://api.login2explore.com:5577";

//To set the baseUrl 
function setBaseUrl(baseUrlArg) {
    baseUrl = baseUrlArg;
}


function executeCommand(reqString, apiEndPointUrl) {
    var url = jpdbBaseURL + apiEndPointUrl;
    var jsonObj;
    // console.log("reached here")
    $.post(url, reqString, function (result) {
        jsonObj = JSON.parse(result);
    }).fail(function (result) {
        var dataJsonObj = result.responseText;
        jsonObj = JSON.parse(dataJsonObj);
    });
    return jsonObj;
}


function createNavReq(token, dbName, relName,nav,rec_no) {
    var partNavReq = "";

    if (nav === "NEXT_RECORD" || nav === "PREV_RECORD") {
        partNavReq = ",\n"
                + "\"record\":"
                + rec_no;
    }
    var req = "{\n"
    + "\"token\" : \""
    + token
    + "\","
    + "\"dbName\": \""
    + dbName
    + "\",\n" + "\"cmd\" : \"" + nav + "\",\n"
    + "\"rel\" : \""
    + relName
    + '"'
    + partNavReq
    + "\,"
    + "\n}";
    // console.log(req)
return req;

}



function createFIRST_RECORDRequest(token, dbName, relName,) {
    return createNavReq(token, dbName, relName,"FIRST_RECORD",0);
}























/*************setFirstRecNo2LS********************* */
function setFirstRecNo2LS(jsonObj){
    var data=JSON.parse(jsonObj.data);
    if(data.rec_no===undefined){
        localStorage.setItem("first_rec_no","0");
    }else{
        localStorage.setItem("first_rec_no",data.rec_no );
    }
}

function setCurrRecNo2LS(jsonObj){
   
    var data =JSON.parse(jsonObj.data);
//    console.log(data)
    localStorage.setItem("rec_no",data.rec_no);
}
/*************getFIrstRecNoFromLS********************* */
function getFirstRecNoFromLS(){
    return localStorage.getItem("first_rec_no")
}
function getCurrRecNoFromLS(){
    return localStorage.getItem("rec_no");
}
/*************setLastRecNo2LS********************* */
function setLastRecNo2LS(jsonObj){
    var data =JSON.parse(jsonObj.data);
    if(data.rec_no===undefined){
        localStorage.setItem("last_rec_no","0");
    }else{
        localStorage.setItem("last_rec_no",data.rec_no);
    }
}
/*************get LastRecNo********************* */
function getLastRecNoFromLS(jsonObj){
    return localStorage.getItem("last_rec_no");
}

/******************************************DISABLE THINGS LOGIC*************************/
 function disableCtrl(ctrl){
    $("#new").prop('disabled',ctrl);
    $("#save").prop('disabled',ctrl);
    $("#edit").prop('disabled',ctrl);
    $("#change").prop('disabled',ctrl);
    $("#reset").prop('disabled',ctrl);
 }
 function disablenav(ctrl){
    $("#first").prop('disabled',ctrl);
    $("#prev").prop('disabled',ctrl);
    $("#next").prop('disabled',ctrl);
    $("#last").prop('disabled',ctrl);
 }
function disableform(bValue){
    $("#empId").prop('disabled',bValue);
    $("#empname").prop('disabled',bValue);
    $("#empsal").prop('disabled',bValue);
    $("#hrd").prop('disabled',bValue);
    $("#da").prop('disabled',bValue);
    $("#deduct").prop('disabled',bValue);
}
/* ************************Show data*********************** */
function showData(jsonObj){
    if(jsonObj.status===400){
       
        return;
    }
    
    var data =(JSON.parse(jsonObj.data)).record;
   
    setCurrRecNo2LS(jsonObj);

    $('#empId').val(data.id);
    $('#empname').val(data.name);
    $('#empsal').val(data.salary);
    $('#hrd').val(data.hrd);
    $('#da').val(data.da);
    $('#deduct').val(data.deduction);

    disablenav(false);
    disableform(true);

    $('#save').prop('disabled',true);
    $('#change').prop('disabled',true);
    $('#reset').prop('disabled',true);
    
    $('#new').prop('disabled',false);
    $('#edit').prop('disabled',false);

    if(getCurrRecNoFromLS()===getLastRecNoFromLS()){
        $('#next').prop('disabled',true);
        $('#last').prop('disabled',true);
    }
    if(getCurrRecNoFromLS()===getFirstRecNoFromLS()){
        $('#prev').prop('disabled',true);
        $('#first').prop('disabled',true);
        return;
    }

}



/*******************************Local storage clean(first time page load)******************** */ 
function initEmpForm(){
    localStorage.removeItem("first_rec_no");
    localStorage.removeItem("last_rec_no");
    localStorage.removeItem("rec_no");
    console.log("initEMpForm()-done")
}

/*******************************Get first employee data******************** */ 

function getFirst(){
    var getFirstreq =createFIRST_RECORDRequest(connToken, empDBName,empRelName);
    // console.log(getFirstreq)
    jQuery.ajaxSetup({async:false});
    var result=executeCommand(getFirstreq,irlPartUrl);
    showData(result);
    setFirstRecNo2LS(result);
    jQuery.ajaxSetup({async:true});
    $('#empId').prop('disabled',true);
    $('#first').prop('disabled',true);
    $('#prev').prop('disabled',true);
    $('#next').prop('disabled',false);
    $('#save').prop('disabled',true);

}

/*******************************Get last employee data******************** */ 


function getLast(){
    var getLastreq =createLAST_RECORDRequest(connToken, empDBName,empRelName);
    jQuery.ajaxSetup({async:false});
    var result=executeCommand(getLastreq,irlPartUrl);
    setLastRecNo2LS(result);
    showData(result);
    jQuery.ajaxSetup({async:true});
    $('#first').prop('disabled',false);
    $('#prev').prop('disabled',false);
    $('#last').prop('disabled',true);
    $('#next').prop('disabled',true);
    $('#save').prop('disabled',true);
}
/*******************************Get previous employee data******************** */ 
function getPrev(){
        var r=getCurrRecNoFromLS();
        if(r===1){
            $('#prev').prop('disabled',true);
            $('#first').prop('disabled',true);
        }
        var getPrevReq=createPREV_RECORDRequest(connToken,empDBName,empRelName,r);
        jQuery.ajaxSetup({async:false});
        var result=executeCommand(getPrevReq,irlPartUrl);
        showData(result);
        jQuery.ajaxSetup({async:true});
        var r=getCurrRecNoFromLS();
        if(r===1){
            $('#first').prop('disabled');
            $('#prev').prop('disabled');
        }
        $("save").prop('disabled',true);

}
/*******************************Get next employee data******************** */ 
function getNext(){
    var r=getCurrRecNoFromLS();
    console.log(r)
    var getnextReq=createNEXT_RECORDRequest(connToken,empDBName,empRelName,r);
    jQuery.ajaxSetup({async:false});
    var result=executeCommand(getnextReq,irlPartUrl);
    showData(result)
    jQuery.ajaxSetup({async:true})
    var r=getCurrRecNoFromLS();
    var t=getLastRecNoFromLS();
    if(r===t){
        $('#next').prop('disabled',true);
        $('#last').prop('disabled',true);
    }
    $('#save').prop('disabled',true);
}


/* *******************************isNoRecordPresentLS************************ */
function isNoRecordPresentLS(){
    if(getFirstRecNoFromLS()==="0"&&getLastRecNoFromLS()==="0"){
        return true;
    }
    return false;
}



/*******************************Check employee data inbetween******************** */ 



function isOnlyRecordPresent(){
    if(isNoRecordPresentLS()){
        return false;
    }
    if(getFirstRecNoFromLS()===getLastRecNoFromLS()){
        return true;
    }
    return false;
}

function checkForNoOrOneRecord(){
    if(isNoRecordPresentLS()){
        disableform(true);
        disablenav(true);
        disableCtrl(true);
        $('#new').prop('disabled',false);
        return;
    }
    if(isOnlyRecordPresent()){
        disableform(true);
        disablenav(true);
        disableCtrl(true);
        $('#new').prop('disabled',false);
        $('#edit').prop('disabled',false);
        return;
    }
}
/* *******************************newForm************************ */

function newForm(){
    makeDataFormEmpty();
    disableform(false);
    $('#empId').focus();
    disablenav(true);
    disableCtrl(true);

    $('#save').prop('disabled',false);
    $('#reset').prop('disabled',false);

}

function makeDataFormEmpty(){
    $('#empId').val("");
    $('#empname').val("");
    $('#empsal').val("");
    $('#hrd').val("");
    $('#da').val("");
    $('#deduct').val("");
}
/* ******************************************Reset Form************************** */
function resetForm(){
    disableCtrl(true);
    disablenav(false);
    var getCurrRequest =createGET_BY_RECORDRequest(connToken,empDBName,empRelName,getCurrRecNoFromLS());
    jQuery.ajaxSetup({async:false});
    var result =executeCommand(getCurrRequest,irlPartUrl);
    showData(result)
    jQuery.ajaxSetup({async:true})
    if(isOnlyRecordPresent()||isNoRecordPresentLS()){
        disablenav(true)
    }
    $("#new").prop('disabled',false);
    if(isNoRecordPresentLS()){
        makeDataFormEmpty();
        $("#edit").prop("disabled",true);
    }else{
        $("#edit").prop("disabled",false);
    }
    disableform(true);
}
/* *******************************Save data************************ */
function savedata(){
    var jsonStrObj =validateData();
    // console.log(jsonStrObj)
    if(jsonStrObj===''){
        return '';
    }
    var putRequest =createPUTRequest(connToken,jsonStrObj,empDBName,empRelName);
    // console.log(putRequest)
    jQuery.ajaxSetup({async:false});
    var jsonObj=executeCommand(putRequest,imlPartUrl);
    jQuery.ajaxSetup({async: true});
    if(isNoRecordPresentLS()){
        setFirstRecNo2LS(jsonObj);
    }
    setLastRecNo2LS(jsonObj);
    setCurrRecNo2LS(jsonObj);
    resetForm();
}

function validateData(){
    var empId,empName,empsal,hrd,da,deduct;
    empId =$('#empId').val();
    empname =$('#empname').val();
    empsal =$('#empsal').val();
    hrd =$('#hrd').val();
    da=$('#da').val();
    deduct=$('#deduct').val();
    if(empId=== ''){
        alert('Employee Id Missing')
        $("#empId").focus();
        return '';
    }
    if(empname=== ''){
        alert('Employee name Missing')
        $("#empname").focus();
        return '';
    }
    if(empsal=== ''){
        alert('Employee salary Missing')
        $("#empsal").focus();
        return '';
    }
    if(hrd=== ''){
        alert('Employee hrd Missing')
        $("#hrd").focus();
        return '';
    }
    if(da=== ''){
        alert('Employee da Missing')
        $("#da").focus();
        return '';
    }
    if(deduct=== ''){
        alert('Employee deduct Missing')
        $("#deduct").focus();
        return '';
    }
    var jsonStrObj ={
        id: empId,
        name: empname,
        salary: empsal,
        hrd: hrd,
        da: da,
        deduction: deduct
    };
    // console.log(jsonStrObj);
    return JSON.stringify(jsonStrObj);

}
/* *******************************Edit data************************ */
function editData(){
    disableform(false);
    $('#empId').prop('disabled',true);
    $('#empname').focus();
    disablenav(true);
    disableCtrl(true);
    $("#change").prop('disabled',false);
    $("#reset").prop('disabled',false);
}
/* *******************************Change data************************ */
function changeData(){
    jsonChg =validateData();
    var updateReq=createUPDATERecordRequest(connToken,jsonChg,empDBName,empRelName,getCurrRecNoFromLS());
    jQuery.ajaxSetup({async:false})
    var jsonObj=executeCommandAtGivenBaseUrl(updateReq,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    // console.log(jsonObj);
    resetForm();
    // $("#empId").focus();
    // $("#edit").focus();

}





initEmpForm();
getFirst();
getLast();
checkForNoOrOneRecord();




