function getPatientIDFromURL(){
    return getParamFromURL("patientID")
}

function deletePatientCall(patientID){
    return $.ajax(
        "/patient/delete/" + patientID,
        {
            dataType: "json",
            type: "DELETE",
            complete: function(result){
            }
        }
    )
}


function callInsertPatient(patient){
    return $.ajax(
        "/patient/insert",
        {
            data: JSON.stringify(patient),
            contentType: "application/json",
            dataType: 'json',
            type: "POST",
            complete: function (result) {}
        }
    )
}

function insertPatient(){
    const patient = getBasicPatientObjFromForm()
    try{
        callInsertPatient(patient).then(data => insertBehandelCombinatie(data.insert_patient.returning[0].persoonid, getArtsId())).then(function(data){
            if (data.responseText !== "FAIL" && data.insert_artsbehandeltpatient.affected_rows === 1){
                displayAlert("patient_new_alert", "Patiënt opgeslagen!", "success")
                window.location.href = "/patients"
            } else {
                displayAlert("patient_new_alert", "Patiënt kon niet worden opgeslagen, probleer het later nog eens", "danger")
            }
        })
    } catch {
        displayAlert("patient_new_alert", "Patiënt kon niet worden opgeslagen, probleer het later nog eens", "danger")
    }

}

function getBasicPatientObjFromForm(){
    return {
        "titels": replaceEmptyStrWithNull(document.getElementById("inputTitels").value),
        "initialen": replaceEmptyStrWithNull(document.getElementById("inputInitialen").value),
        "voorvoegsels": replaceEmptyStrWithNull(document.getElementById("inputVoorvoegsels").value),
        "achternaam": replaceEmptyStrWithNull(document.getElementById("inputAchternaam").value),
        "voornamen": replaceEmptyStrWithNull(document.getElementById("inputVoornaam").value),
        "roepnaam": replaceEmptyStrWithNull(document.getElementById("inputRoepnaam").value),
        "geslacht": replaceEmptyStrWithNull(document.getElementById("inputGeslacht").value),
        "geboortedatum": replaceEmptyStrWithNull(document.getElementById("inputGebdat").value),
        "straat":replaceEmptyStrWithNull(document.getElementById("inputStraat").value),
        "postcode":replaceEmptyStrWithNull(document.getElementById("inputPostcode").value),
        "huisnummer":replaceEmptyStrWithNull(document.getElementById("inputHuisnummer").value),
        "woonplaats":replaceEmptyStrWithNull(document.getElementById("inputWoonplaats").value),
        "gemeente":replaceEmptyStrWithNull(document.getElementById("inputGemeente").value),
        "emailadres":replaceEmptyStrWithNull(document.getElementById("inputEmailadres").value),
        "telefoonnummer":replaceEmptyStrWithNull(document.getElementById("inputTelefoonnummer").value),
        "woningdatum":replaceEmptyStrWithNull(document.getElementById("inputWoningdatum").value),
        "woningtype":replaceEmptyStrWithNull(document.getElementById("WoningTypeCodelijst").value),
        "woningomstandigheid":replaceEmptyStrWithNull(document.getElementById("WoonOmstandigheidCodelijst").value),
        "woningaanpassing":replaceEmptyStrWithNull(document.getElementById("WoningAanpassingCodelijst").value),
        "woningtoelichting":replaceEmptyStrWithNull(document.getElementById("inputToelWoning").value),
        "iq":replaceEmptyStrWithNull(document.getElementById("inputIQ").value),

    }
}

function updatePatient(patient){
    return $.ajax(
        "/patient/update",
        {
            data: JSON.stringify(patient),
            contentType: "application/json",
            dataType: 'json',
            type: "POST",
            complete: function (result) {}
        }
    )
}


function showPatientDetails(){
    const patientID = getPatientIDFromURL()
    getPatientInfo(patientID).then(patient => getPatientDiagnoses(patientID)).then(getMetingenForPatient(patientID)).then(createMetingGraphs(patientID)).then(function(){
        sessionStorage.setItem("selectedPatientID", patientID)
    })
}

function fillPatientDetailsFields(patientData){
    try {
        document.getElementById("inputTitels").value = patientData.persoonByPersoonid.titels
        document.getElementById("inputVoornaam").value = patientData.persoonByPersoonid.voornamen
        document.getElementById("inputInitialen").value = patientData.persoonByPersoonid.initialen
        document.getElementById("inputRoepnaam").value = patientData.persoonByPersoonid.roepnaam
        document.getElementById("inputVoorvoegsels").value = patientData.persoonByPersoonid.voorvoegsels
        document.getElementById("inputAchternaam").value = patientData.persoonByPersoonid.achternaam
        document.getElementById("inputGeslacht").value = patientData.geslacht
        document.getElementById("inputGebdat").value = patientData.geboortedatum
        document.getElementById("inputStraat").value = patientData.straat
        document.getElementById("inputPostcode").value = patientData.postcode
        document.getElementById("inputHuisnummer").value = patientData.huisnummer
        document.getElementById("inputWoonplaats").value = patientData.woonplaats
        document.getElementById("inputGemeente").value = patientData.gemeente
        document.getElementById("inputEmailadres").value = patientData.emailadres
        document.getElementById("inputTelefoonnummer").value = patientData.telefoonnummer
        document.getElementById("inputWoningdatum").value = patientData.woningdatum
        document.getElementById("WoningTypeCodelijst").value = patientData.woningtype
        document.getElementById("WoonOmstandigheidCodelijst").value = patientData.woningomstandigheid
        document.getElementById("WoningAanpassingCodelijst").value = patientData.woningaanpassing
        document.getElementById("inputToelWoning").value = patientData.woningtoelichting
        document.getElementById("inputIQ").value = patientData.iq

        document.getElementById("inputPatientID").value = patientData.patientid
        document.getElementById("inputPersoonID").value = patientData.persoonByPersoonid.persoonid
    }
    catch (error) {
        console.error("Velden invullen mislukt:", error)
    }
}

function getSelectedPatientId(){
    return sessionStorage.getItem("selectedPatientID")
}

function savePatientAccountChanges(){
    let patient = getBasicPatientObjFromForm()
    patient["patientid"] = parseInt(document.getElementById("inputPatientID").value)
    patient["persoonid"] = parseInt(document.getElementById("inputPersoonID").value)

    updatePatient(patient).then(data => updatePersoon(patient, data)).done(function(){
        displayAlert("patient_update_alert", "Wijzigingen opgeslagen!", "success")
        window.location.reload()
    }).fail(function(){
        displayAlert("patient_update_alert", "Wijzigingen konden niet worden opgeslagen, probeer het later nog eens", "danger")
    })
}

function loadPatientDetails(){
    const patientID = sessionStorage.getItem("patientID")
    $.getJSON("/patient/get/" + patientID, {}, function(result){
        fillPatientDetailsFields(result.patient[0])
    })
}