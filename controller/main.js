import { Car } from "../model/car.js";
import { carServices} from "../services/carServices.js";


function getEle(el) {
    return document.querySelector(el);
}
function geteleAll(el) {
    return document.querySelectorAll(el);
}

const CarServices = new carServices();

const btnAddCar = getEle('.btn-new-car');
const formPopup = getEle('.form-popup');
const closePopup = getEle(".close-popup");
const markUp = getEle(".mark-up");
const btnSubmit = getEle(".btn-submit");
const listCars = getEle(".list-cars");
const inputValue = geteleAll(".input-value");
const btnUpdate = getEle('.btn-update');
const loading = getEle(".loading");

const displayForm = function() {
    formPopup.classList.add("visible");
    markUp.classList.add("visible");
    
}
const removeForm = function() {
    formPopup.classList.remove("visible");
    markUp.classList.remove("visible");
    btnSubmit.classList.remove("display");
    btnUpdate.classList.remove("display");
}


btnAddCar.addEventListener('click',function() {
    inputValue.forEach(item => {
        item.value = "";
    });
    btnSubmit.classList.add("display");
    displayForm();
});
closePopup.addEventListener('click',removeForm);
markUp.addEventListener('click',removeForm);

const getCars = function() {
    loading.classList.add("visible");
    CarServices.getCar().then(function(res) {
        setTimeout(function() {
            renderData(res.data);
            loading.classList.remove("visible");
        },400);
        
    }).catch(function(err) {
        console.log(err);
    });
}
getCars();

const addCar = function() {
    let arrayValueDefault = ["car name", "https://static.kbb.ca/Themes/GPS/Images/DefaultCar.svg",1000,"There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour"];

    inputValue.forEach((item,index) => {
        if(item.value !== "") {
            arrayValueDefault[index] = item.value;
        }
    });

    let [_name, _img, _price, _description] = arrayValueDefault;

    const car = new Car(_name, _img, _price, _description);

    CarServices.addCar(car)
    .then(function(res){
        localStorage.setItem('ListCar', JSON.stringify(res.data));
        getCars();
    }).catch(function(err){
        console.log(err);
    });

    arrayValueDefault = [];
    inputValue.forEach(item => {
        item.value = "";
    });

    removeForm();
}

const updateCar = function() {
    let arrayValue = [];

    inputValue.forEach(item => {
        arrayValue.push(item.value);
    });

    const id = getEle(".field-name").dataset.index;

    let [_name, _img, _price, _description] = arrayValue;

    const car = new Car(_name, _img, _price, _description);

    CarServices.editCar(id,car)
    .then(function(res){
        localStorage.setItem('ListCar', JSON.stringify(res.data));
        getCars();
    }).catch(function(err){
        console.log(err);
    });
    getEle(".field-name").removeAttribute('data-index');

    arrayValue = [];
    inputValue.forEach(item => {
        item.value = "";
    });
    
    removeForm();
}

const carAction = function(e){
    const deleteBtn = e.target.closest(".delete");
    const editBtn = e.target.closest(".edit");
    if(deleteBtn) {
        const deleteIndex = deleteBtn.dataset.delete;
        CarServices.deleteCar(deleteIndex)
        .then(function(res) {
            getCars();
        })
        .catch((err) => console.log(err))
    }else if(editBtn) {
        btnSubmit.classList.remove("display");
        btnUpdate.classList.add("display");
        let arrayValueCar;
        const editIndex = editBtn.dataset.edit;
        CarServices.getOneCar(editIndex)
        .then(function(res) {
            arrayValueCar = Object.values(res.data);
            getEle(".field-name").dataset.index = editIndex;
            inputValue.forEach((item, index) => {
                item.value = arrayValueCar[index + 1];
            });
            displayForm();
        })
        .catch(err => console.log(err));
        console.log();
    }
}

listCars.onclick = carAction;

const renderData = function(arrayCars) {
    let content = arrayCars.map((car,index) => 
        `<li class="car-item ${index}"> 
            <article class="post post-car">
                <div class="car-thumb">
                    <a href="#">
                        <img src="${car.image}" alt="${car.name}">
                    </a>
                    <div class="car-action">
                        <p class="edit" data-edit=${car.id}>
                            <i class="fa fa-edit"></i>
                        </p>
                        <p class="delete" data-delete=${car.id}>
                            <i class="fa fa-trash-o"></i>
                        </p>
                    </div>
                </div>
                <div class="car-text">
                    <h3 class="car-title">
                        ${car.name}
                    </h3>
                    <p class="car-description">
                        ${car.description}
                    </p>
                    <p class="car-price">
                        ${car.price}$
                    </p>
                </div>
            </article>
        </li> `
    ).join('');

    getEle(".list-cars").innerHTML = content;
}

btnSubmit.addEventListener('click',addCar);
btnUpdate.addEventListener('click',updateCar);

