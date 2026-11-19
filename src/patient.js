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

function deletePatient(){
    const patientID = sessionStorage.getItem("selectedPatientID")

    try{
        deleteBehandelCombinatie(patientID, getArtsId())
            .then(deletePatientCall(patientID))
            .then(deletePersoon(patientID))
            .then(function(data){
                if (data !== "FAIL"){
                    displayAlert("patient_details_alert", "Patiënt verwijderd!", "success")
                    window.location.href = "/patients"
                } else {
                    hideModal()
                    displayAlert("patient_details_alert", "Patiënt kon niet worden verwijderd, probeer het later nog eens", "danger")
                }
            })
    } catch {
        hideModal()
        displayAlert("patient_details_alert", "Patiënt kon niet worden verwijderd, probeer het later nog eens", "danger")
    }

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
        "gender": parseInt(document.getElementById("inputGender").value),
        "geslacht": replaceEmptyStrWithNull(document.getElementById("inputGeslacht").value),
        "geboortedatum": replaceEmptyStrWithNull(document.getElementById("inputGebdat").value),
        "schooltype": replaceEmptyStrWithNull(document.getElementById("inputSchooltype").value),
        "schooltype_toelichting": replaceEmptyStrWithNull(document.getElementById("inputToel").value)
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

function savePatientChanges(){
    let patient = getBasicPatientObjFromForm()
    patient["patientid"] = parseInt(document.getElementById("inputPatientID").value)
    patient["persoonid"] = parseInt(document.getElementById("inputPersoonID").value)

    updatePatient(patient).then(data => updatePersoon(patient, data)).done(function(){
        window.location.reload()
        displayAlert("patient_details_alert", "Wijzigingen opgeslagen!", "success")
    }).fail(function(){
        displayAlert("patient_details_alert", "Wijzigingen konden niet worden opgeslagen, probeer het later nog eens", "danger")
    })
}

function getPatientInfo(patientID){
    return $.getJSON("patient/get/" + patientID, {}, function(result){
        fillPatientDetailsFields(result.patient[0])
        return result.patient[0]
    })
}

function showPatientDetails(){
    const patientID = getPatientIDFromURL()
    getPatientInfo(patientID).then(patient => getPatientDiagnoses(patientID)).then(getMetingenForPatient(patientID)).then(createMetingGraphs(patientID)).then(function(){
        sessionStorage.setItem("selectedPatientID", patientID)
    })
}

function fillPatientDetailsFields(patientData){
    document.getElementById("inputTitels").value = patientData.persoonByPersoonid.titels
    document.getElementById("inputVoornaam").value = patientData.persoonByPersoonid.voornamen
    document.getElementById("inputInitialen").value = patientData.persoonByPersoonid.initialen
    document.getElementById("inputRoepnaam").value = patientData.persoonByPersoonid.roepnaam
    document.getElementById("inputVoorvoegsels").value = patientData.persoonByPersoonid.voorvoegsels
    document.getElementById("inputAchternaam").value = patientData.persoonByPersoonid.achternaam
    document.getElementById("inputGender").value = patientData.gender
    document.getElementById("inputGeslacht").value = patientData.geslacht
    document.getElementById("inputGebdat").value = patientData.geboortedatum
    document.getElementById("inputPatientID").value = patientData.patientid
    document.getElementById("inputPersoonID").value = patientData.persoonByPersoonid.persoonid
    try {
        document.getElementById("inputSchooltype").value = patientData.schooltype
        document.getElementById("inputToel").value = patientData.schooltype_toelichting
    }
    catch {}
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