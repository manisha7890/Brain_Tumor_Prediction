$(document).ready(function () {
  // Init
  $(".image-section").hide();
  $(".loader").hide();
  $("#result").hide();

  // Upload Preview
  function readURL(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("#imagePreview").css(
          "background-image",
          "url(" + e.target.result + ")"
        );
        $("#imagePreview").hide();
        $("#imagePreview").fadeIn(650);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  $("#imageUpload").change(function () {
    $(".image-section").show();
    $("#btn-predict").show();
    $("#result").text("");
    $("#result").hide();
    readURL(this);
  });

  // Predict
  $("#btn-predict").click(function () {
    var form_data = new FormData($("#upload-file")[0]);

    // Show loading animation
    $(this).hide();
    $(".loader").show();

    // Make prediction by calling api /predict
    $.ajax({
      type: "POST",
      url: "/predict",
      data: form_data,
      contentType: false,
      cache: false,
      processData: false,
      async: true,
      success: function (y) {
        // Get and display the result
        obj = JSON.parse(y);
        labels = ["Glioma", "Meningioma", "No Tumor", "Pituitary"];
        ind = 0;
        for (let i = 0; i < labels.length; i++) {
          if (labels[i] === obj["pred"]) {
            ind = i;
            break;
          }
        }
        links = [obj["glink"], obj["mlink"], obj["nlink"], obj["plink"]];
        $(".loader").hide();
        $("#result").fadeIn(600);
        if (obj["pred"] == "Glioma")
        {
        $("#result").text(" Result :  " + obj["pred"] + ": Glioma is a growth of cells that starts in the brain or spinal cord. The cells in a glioma look similar to healthy brain cells called glial cells. Glial cells surround nerve cells and help them function. As a glioma grows it forms a mass of cells called a tumor.");
        }
        else if (obj["pred"] == "Meningioma")
        {
        $("#result").text(" Result :  " + obj["pred"] + ": A meningioma is a primary central nervous system (CNS) tumor. This means it begins in the brain or spinal cord. Overall, meningiomas are the most common type of primary brain tumor.");
        }
        else if (obj["pred"] == "Pituitary")
        {
        $("#result").text(" Result :  " + obj["pred"] + ": Pituitary tumors are unusual growths that develop in the pituitary gland. This gland is an organ about the size of a pea. It's located behind the nose at the base of the brain. Some of these tumors cause the pituitary gland to make too much of certain hormones that control important body functions.");
        }
        else if (obj["pred"] == "No Tumor")
        {
        $("#result").text(" Result :  " + obj["pred"]);
        }
        $("#glioma").text(obj["glioma"] + "%");
        $("#meningioma").text(obj["meningioma"] + "%");
        $("#notumor").text(obj["notumor"] + "%");
        $("#pituitary").text(obj["pituitary"] + "%");
        console.log("Success!");

      },
    });
  });
});
