function getPersoonNaam(persoon){
    let naam = ""
    if (persoon.titels !== "" && persoon.titels != null) {naam += persoon.titels + " "}
    naam += persoon.roepnaam + " "
    if (persoon.voorvoegsels !== "" && persoon.voorvoegsels != null) {naam += persoon.voorvoegsels + " "}
    return naam + persoon.achternaam
}

function updatePersoon(persoon, data){
    if (data === "FAIL"){
        return $.Deferred().reject(data).promise()
    }
    return $.ajax(
        "/persoon/update",
        {
            data: JSON.stringify(persoon),
            contentType: "application/json",
            dataType: "json",
            type: "POST",
            complete: function(result){
            }
        }
    )
}

function deletePersoon(persoonID){
    return $.ajax(
        "/persoon/delete/" + persoonID,
        {
            type: "DELETE",
            complete: function(result){
            }
        }
    )
}
