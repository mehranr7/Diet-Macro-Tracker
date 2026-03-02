var
currentProtein = parseFloat(localStorage.getItem("currentProtein")),
currentCarb = parseFloat(localStorage.getItem("currentCarb")),
currentFat = parseFloat(localStorage.getItem("currentFat")),
targetProtein = parseFloat(localStorage.getItem("targetProtein")),
targetCarb = parseFloat(localStorage.getItem("targetCarb")),
targetFat = parseFloat(localStorage.getItem("targetFat")),
isDark = localStorage.getItem("isDark"),
weight = parseFloat(localStorage.getItem("weight")),
height = parseFloat(localStorage.getItem("height")),
meals = parseInt(localStorage.getItem("meals")),
context = JSON.parse(localStorage.getItem("context")),
foodsArray = JSON.parse(localStorage.getItem("foodsArray"));

currentProtein = currentProtein?currentProtein:0;
currentCarb = currentCarb?currentCarb:0;
currentFat = currentFat?currentFat:0;

if(targetProtein || targetCarb || targetFat ||
    weight || height || meals){
    $($(".setting .btn")[1]).attr("onclick","closeSetting()");
    $(".statusContainer , .options , .usedFood").fadeIn();
    updateState(currentProtein,currentCarb,currentFat);
}
else{
    $("body > .container > div:not(.setting)").fadeOut();
    $($(".setting .btn")[1]).attr('onclick','alert("لطفا مقادیر اهداف را مشخص کنید.")');
    openSetting();
    alert("لطفا مقادیر اهداف را مشخص کنید.");
}

if(!context)
    downloadContext();
else
{
    var options = "";
    context.forEach(food => {
        options += '<option class="dark3" value="'+food.id+'">'+food.name+'</option>';
    });
    document.getElementById("food").innerHTML = options;
}

if((isDark==null || isDark)!="false")
    setDarkTheme();
else
    setLightTheme();

    
if(foodsArray==null)
    foodsArray = {};
else
    Object.keys(foodsArray).forEach(food => {
        addFoodSubmit(true,foodsArray[food][0],foodsArray[food][1],true);
    }); 

function downloadContext() {
  $.ajax({
    url: "Db.json",
    method: "GET",
    dataType: "json",
    cache: false
  })
    .done(function (response) {
      context = response;

      let options = '<option value="" disabled selected>انتخاب کنید...</option>';
      context.forEach((food) => {
        options += `<option class="dark3" value="${food.id}">${food.name}</option>`;
      });

      document.getElementById("food").innerHTML = options;
      localStorage.setItem("context", JSON.stringify(context));
    })
    .fail(function () {
      alert("خطا در دریافت دیتابیس. لطفا بعدا تلاش کنید.");
    });
}


function FaToEn(str) {
    var persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    if(typeof str === 'string')
    {
      for(var i=0; i<10; i++)
      {
        str = str.replace(persianNumbers[i], i);
      }
    }
    return str;
}

function EnToFa(str) {
    var englishNumbers = [/0/g, /1/g, /2/g, /3/g, /4/g, /5/g, /6/g, /7/g, /8/g, /9/g];
    var persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    if(typeof str === 'string')
    {
      for(var i=0; i<10; i++)
      {
        str = str.replace(englishNumbers[i],persianNumbers[i]);
      }
    }
    return str;
}

function addFood() {
    $(".usedFood , .options , .resetAlert").fadeOut(200);
    setTimeout(function(){
        $(".addFoodForm").fadeIn(200);
    }, 300);
    return false;
}

function calculator(foodId, foodAmount) {
  if (foodAmount === "" || foodAmount < 0) return null;

  const food = context.find((f) => String(f.id) === String(foodId));
  if (!food) return null;

  const amount = Number(foodAmount);

  const pPer100 = Number.parseFloat(food.protein) || 0;
  const cPer100 = Number.parseFloat(food.carbs) || 0;
  const fPer100 = Number.parseFloat(food.fat) || 0;

  return [
    (pPer100 * amount) / 100,
    (cPer100 * amount) / 100,
    (fPer100 * amount) / 100,
    food.name
  ];
}

function addFoodSubmit(shouldSave,
    foodId = document.getElementById("food").value,
    foodAmount = document.getElementById("foodAmount").value,
    isPreLoad = false)
    {

    var food = calculator(foodId,foodAmount);
    if(food==null || foodAmount=="" || foodAmount <0)
    {
        if(shouldSave)
        alert("لطفا میزان ماده غذایی را به درستی وارد کنید.");
        return false;
    }
    var foodProtein = food[0];
    var foodCarbs = food[1];
    var foodFat = food[2];

    if(shouldSave){
        currentProtein += foodProtein;
        currentCarb += foodCarbs;
        currentFat += foodFat;
    }

    if(shouldSave)
    {
        var theme3 = isDark?"dark3":"light3";
        var theme4 = isDark?"dark4":"light4";

        var foodBase = `     
        <div class="foodBase row" onclick="toggleDetails(this)">
            <div class="food col-12 py-1 `+theme3+`">
                <span class="foodName">`+food[3]+`</span>
                <span class="amount">`+EnToFa(foodAmount)+` <small>گرم</small></span>
            </div>
            <div class="foodDetails `+theme4+` container" style="display: none;">
                <div class="row">
                    <div class="col-md-4 col-right px-4">
                        <div class="d-flex justify-content-between">
                            <span>پروتئین</span>
                            <span>`+EnToFa(foodProtein.toFixed(0))+` گرم</span>
                        </div>
                    </div>
                    <div class="col-md-4 px-4">
                        <div class="d-flex justify-content-between">
                            <span>کربوهیدرات</span>
                            <span>`+EnToFa(foodCarbs.toFixed(0))+` گرم</span>
                        </div>
                        </div>
                    <div class="col-md-4 col-left px-4">
                        <div class="d-flex justify-content-between">
                            <span>چربی</span>
                            <span>`+EnToFa(foodFat.toFixed(0))+` گرم</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    
    if(!shouldSave)
    {
        updateState(
            currentProtein + foodProtein,
            currentCarb + foodCarbs,
            currentFat + foodFat);
            return false;
    }
    else{
        $(".addFoodForm").fadeOut(200);
        setTimeout(function(){
            document.getElementsByClassName("usedFood")[0].innerHTML += foodBase;
            $(".usedFood , .options").fadeIn(200);
            updateState(
                currentProtein,
                currentCarb,
                currentFat);
            document.getElementById("foodAmount").value = "";
            if(!isPreLoad)
            {
                foodsArray[freeFoodArrayId()] = [foodId,foodAmount];
                localStorage.setItem("foodsArray",JSON.stringify(foodsArray));
            }
            return false;
        }, 300);
    }
}

function freeFoodArrayId() {
    i = 0;
    while (foodsArray[i] != undefined) {
        i++;
    }
    return i;
}

function addFoodCancell(){
    updateState(currentProtein,currentCarb,currentFat);
    $(".addFoodForm").fadeOut(200);
    setTimeout(() => {
        $(".usedFood , .options").fadeIn(200);
    }, 300);
    return false;
}

function toggleDetails(self) {
    $(self.getElementsByClassName("foodDetails")).slideToggle();
}

function updateState(protein,carbs,fat){
    var proteinStateSpan = $("#proteinProgress span");
    var proteinProgressPass = $("#proteinProgress .progressPass");
    var carbsStateSpan = $("#carbsProgress span");
    var carbsProgressPass = $("#carbsProgress .progressPass");
    var fatStateSpan = $("#fatProgress span");
    var fatProgressPass = $("#fatProgress .progressPass");

    proteinStateSpan[0].innerHTML= EnToFa(protein.toFixed(0))+" <small>گرم</small>";
    proteinStateSpan[2].innerHTML= EnToFa(targetProtein.toFixed(0))+" <small>گرم</small>";
    var proteinPass = (protein/targetProtein)*100;
    if(proteinPass>100)
        proteinPass = 100;
    else if(proteinPass<0)
        proteinPass = 0;
    proteinProgressPass[0].style.width = proteinPass.toFixed(0)+"%";

    carbsStateSpan[0].innerHTML= EnToFa(carbs.toFixed(0))+" <small>گرم</small>";
    carbsStateSpan[2].innerHTML= EnToFa(targetCarb.toFixed(0))+" <small>گرم</small>";
    var carbPass = (carbs/targetCarb)*100;
    if(carbPass>100)
        carbPass = 100;
    else if(carbPass<0)
        carbPass = 0;
    carbsProgressPass[0].style.width = carbPass.toFixed(0)+"%";

    fatStateSpan[0].innerHTML= EnToFa(fat.toFixed(0))+" <small>گرم</small>";
    fatStateSpan[2].innerHTML= EnToFa(targetFat.toFixed(0))+" <small>گرم</small>";
    var fatPass = (fat/targetFat)*100;
    if(fatPass>100)
        fatPass = 100;
    else if(fatPass<0)
        fatPass = 0;
    fatProgressPass[0].style.width = fatPass.toFixed(0)+"%";
}

function instantCalculator() {
    var foodId = document.getElementById("food").value;
    var foodAmount = document.getElementById("foodAmount").value;
    if(foodAmount=="" || foodAmount <0)
        return false;

    var food = context.find(f=>f.id==foodId);
    var foodProtein = food.protein*foodAmount;
    var foodCarbs = food.carbs*foodAmount;
    var foodFat = food.fat*foodAmount;
    var proteinStateSpan = $("#calculatorProtein span");
    var carbsStateSpan = $("#calculatorCarbs span");
    var fatStateSpan = $("#calculatorFat span");
    proteinStateSpan[1].innerHTML= EnToFa(foodProtein.toFixed(0))+" گرم";
    carbsStateSpan[1].innerHTML= EnToFa(foodCarbs.toFixed(0))+" گرم";
    fatStateSpan[1].innerHTML= EnToFa(foodFat.toFixed(0))+" گرم";
}

function resetToggle() {
    $(".resetAlert").fadeToggle();
}

function setLightTheme() {
    $(".dark1").addClass("light1").removeClass("dark1");
    $(".dark2").addClass("light2").removeClass("dark2");
    $(".dark3").addClass("light3").removeClass("dark3");
    $(".dark4").addClass("light4").removeClass("dark4");
    $(".dark5").addClass("light5").removeClass("dark5");
    $(".dark6").addClass("light6").removeClass("dark6");
    $(".dark7").addClass("light7").removeClass("dark7");
    $(".btn-dark").addClass("btn-light").removeClass("btn-dark");
    $(".themeToggler").css("right","35px");
    isDark = false;
    localStorage.setItem("isDark",isDark);
}
function setDarkTheme() {
    $(".light1").addClass("dark1").removeClass("light1");
    $(".light2").addClass("dark2").removeClass("light2");
    $(".light3").addClass("dark3").removeClass("light3");
    $(".light4").addClass("dark4").removeClass("light4");
    $(".light5").addClass("dark5").removeClass("light5");
    $(".light6").addClass("dark6").removeClass("light6");
    $(".light7").addClass("dark7").removeClass("light7");
    $(".btn-light").addClass("btn-dark").removeClass("btn-light"); 
    $(".themeToggler").css("right","2px"); 
    isDark = true;
    localStorage.setItem("isDark",isDark);
}
function toggleTheme(){
    if(isDark)
        setLightTheme();
    else
        setDarkTheme();
}

function resetConfirm(){
    currentProtein = 0;
    currentCarb = 0;
    currentFat = 0;
    foodsArray = {};
    localStorage.setItem("currentProtein",currentProtein);
    localStorage.setItem("currentCarb",currentCarb);
    localStorage.setItem("currentFat",currentFat);
    localStorage.setItem("foodsArray",JSON.stringify(foodsArray));
    $(".foodBase").remove();
    updateState(currentProtein,currentCarb,currentFat);
    $(".resetAlert").fadeOut();
}

function openSetting() {
    $(".usedFood , .options , .resetAlert").fadeOut(200);
    setTimeout(function(){
        if(targetProtein)
            $("#pTarget").val(targetProtein);
        if(targetCarb)
            $("#cTarget").val(targetCarb);
        if(targetFat)
            $("#fTarget").val(targetFat);
        if(weight)
            $("#wTarget").val(weight);
        if(height)
            $("#hTarget").val(height);
        if(meals)
            $("#mTarget").val(meals);
        $(".setting").fadeIn(200);
    }, 300);
    return false;
}
function closeSetting(){
    $(".setting").fadeOut(200);
    setTimeout(function(){
        $(".usedFood , .options").fadeIn(200);
    }, 300);
    return false;
}
function saveSetting() {
targetProtein = parseInt($("#pTarget").val());
targetCarb = parseInt($("#cTarget").val());
targetFat = parseInt($("#fTarget").val());
weight = parseInt($("#wTarget").val());
height = parseInt($("#hTarget").val());
meals = parseInt($("#mTarget").val());
if(targetProtein || targetCarb || targetFat ||
    weight || height  || meals ||
    targetProtein>0 || targetCarb>0 || targetFat>0 ||
    weight>0 || height>0 || meals>0)
{
    localStorage.setItem("targetProtein",targetProtein);
    localStorage.setItem("targetCarb",targetCarb);
    localStorage.setItem("targetFat",targetFat);
    localStorage.setItem("weight",weight);
    localStorage.setItem("height",height);
    localStorage.setItem("meals",meals);
    
    closeSetting();
    $($(".setting .btn")[1]).attr("onclick","closeSetting()");
    $(".statusContainer , .options , .usedFood").fadeIn();
    updateState(currentProtein,currentCarb,currentFat);
}
else
    alert("لطفا مقادیر را به صورت کامل پر کنید.");
}
document.getElementById("foodAmount").addEventListener("keyup",function() {
    addFoodSubmit(false);
    instantCalculator();
});
document.getElementById("food").addEventListener("change",function() {
    addFoodSubmit(false);
    instantCalculator();
});

$(".addFoodForm form").submit(function(event){
    event.preventDefault();
    addFoodSubmit(true);
});