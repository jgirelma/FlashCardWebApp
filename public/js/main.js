/* eslint-env jquery, browser */
$(document).ready(() => {

  //For create
  cardHtml = `<div class="form-group row"></div><div class="dropdown-divider col-md-8"></div><label class="col-md-2 col-form-label font-weight-bold" for="front">Front</label>
  <div class="col-md-8">
    <textarea class="form-control" type="text" name="front" id="front" autocomplete="front" required="required"></textarea>
  </div>
  <div class="form-group row"></div>
  <label class="col-md-2 col-form-label font-weight-bold" for="back">Back</label>
  <div class="col-md-8">
    <textarea class="form-control" type="text" name="back" id="back" autocomplete="back" required="required"></textarea>
  </div>
  <div class="form-group row"></div>`;
  
  $('.addCard').on('click', (e) => {
    console.log($('.form-group.row').last());
    $('.form-group.row').last().replaceWith(cardHtml);
  });


  //for card viewer
  $('.carousel-item').first().addClass('active');

  $('.carousel-item').on('click', (e) => {
    let currentTarget = e.currentTarget;
    let outerDivHoldingText = currentTarget.firstChild;
    let front = outerDivHoldingText.firstChild;
    let back = outerDivHoldingText.lastChild;

    if (front.classList.contains("d-none")) {
      front.classList.remove("d-none");
    } else {
      front.classList.add("d-none");
    }

    if (back.classList.contains("d-none")) {
      back.classList.remove("d-none");
    } else {
      back.classList.add("d-none");
    }
  });
});
