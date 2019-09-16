function createArticleCard(articleData) {
    $("#article-wrapper").empty();
    articleData.forEach(article => {
        const newDiv = $("<div>").append(
            (`<div class="view overlay">`),
            (`<img class="card-img-top" src="../img/nano${(Math.floor(Math.random(2)*10))+1}.jpg"
                alt="NanoPart Img">`),
            (`<a><div class="mask rgba-white-slight"></div></a>`),
            (`<div class="card-body elegant-color white-text rounded-bottom">`),
            (`<a class="activator waves-effect mr-4"><i class="fas fa-share-alt white-text"></i></a>`),
            (`<h4 class="card-title">${article.title}</h4>`),
            (`<hr class="hr-light">`),
            (`<p class="card-text white-text mb-4">${article.summary}</p>`),
            (`<a href="${article.url}" id="readMoreLink" class="white-text d-flex justify-content-end"><h5>Read more <i class="fas fa-angle-double-right"></i></h5></a>`),
        );
        newDiv.addClass("article-ind")
        $("#article-wrapper").append(newDiv)
    });
}
//Start onload process-------------------------------------------------
$.getJSON("/articles", function (data) {
    createArticleCard(data)
});

//TODO - add url link for 
$("#readMoreLink").on("click", function () {
    alert("Read more link clicked")
}
);