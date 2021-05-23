document.addEventListener('DOMContentLoaded', () => {

  //accordion

  const featureLinkElems = document.querySelectorAll('.feature__link');
  const featureSubElems = document.querySelectorAll('.feature-sub');

  /*for(let i = 0; i < featureLinkElems.length; i++) {
    featureLinkElems[i].addEventListener('click', () => {
      featureSubElems[i].classList.toggle('hidden');
      featureLinkElems[i].classList.toggle('feature__link_active');
    })
  }*/

  featureLinkElems.forEach((btn, index) => {
    btn.addEventListener('click', () => {

      if(btn.classList.contains('feature__link_active')) {
        btn.classList.remove('feature__link_active');
        featureSubElems[index].classList.add('hidden');
      } else {
        featureSubElems.forEach((featureSubElem) => {
          featureSubElem.classList.add('hidden');
        });
        featureLinkElems.forEach((featureLinkElem) => {
          featureLinkElem.classList.remove('feature__link_active');
        });

      featureSubElems[index].classList.remove('hidden');
      btn.classList.add('feature__link_active');
      }
    })
  })

  //smothScroll

  const smothScrollElems = document.querySelectorAll('a[href^="#"]:not(a[href="#"])');

  smothScrollElems.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault()
      const id = link.getAttribute('href').substring(1)

      document.getElementById(id).scrollIntoView({
        behavior: 'smooth'
      });
    })
  })

  //tabs

  const tabsHandlerElems = document.querySelectorAll('[data-tabs-handler]');
  const tabsFieldElems = document.querySelectorAll('[data-tabs-field]');

  for (const tab of tabsHandlerElems) {
    tab.addEventListener('click', () => {
      tabsHandlerElems.forEach(item => {
        if (tab === item) {
          item.classList.add('design-list__item_active');
        } else {
          item.classList.remove('design-list__item_active');
        }
      })

      tabsFieldElems.forEach(item => {
        if (item.dataset.tabsField === tab.dataset.tabsHandler) {
          item.classList.remove('hidden')
        } else {
          item.classList.add('hidden')
        }
      })
    })
  }

  //modal

  const designBlockElem = document.querySelector('.design-block');
  const modalElem = document.querySelector('.modal');

  const openModal = () => {
    modalElem.classList.remove('hidden');
    disableScroll();
  };

  const closeModal = () => {
    modalElem.classList.add('hidden');
    enableScroll();
  };

  designBlockElem.addEventListener('click', e => {
    const target = e.target;

    if (target.matches('.more')) {
      openModal();
    }
  });

  modalElem.addEventListener('click', e => {
    const target = e.target;

    if (target.classList.contains('overlay') || 
      target.classList.contains('modal__close')) {
        closeModal()
    }
  })

  //block Scroll

  const disableScroll = () => {
    document.body.dataset.scrollY = window.scrollY;

    const scrollWidth = window.innerWidth - document.body.offsetWidth

    document.body.style.cssText = `
    position: fixed;
    top: -${window.scrollY}px;
    left: 0;
    width: 100%;
    overflow: hidden;
    height: 100vh;
    padding-right: ${scrollWidth}px;
    `;
  };

  const enableScroll = () => {
    document.body.style.cssText = '';
    window.scroll({
      top: document.body.dataset.scrollY
    });
  };

  //burger menu

  const menuElem = document.querySelector('.menu');
  const humburgerElem = document.querySelector('.humburger-menu');

  const handlerMenu = e => {
    const target = e.target;
    const parent = target.closest('.menu');

    if ((!parent && target !== humburgerElem) ||
      target.classList.contains('menu-list__link')) {
      toggleMenu()
    }
  };

  const toggleMenu = () => {
    menuElem.classList.toggle('menu-active');
    humburgerElem.classList.toggle('humburger-menu-active');

    if (menuElem.classList.contains('menu-active')) {
      document.body.addEventListener('click', handlerMenu)
    } else {
      document.body.removeEventListener('click', handlerMenu)
    }
  };

  humburgerElem.addEventListener('click', toggleMenu);

  //send Form / jsonplaceholder.typicode.com - server

  const server = 'https://jsonplaceholder.typicode.com/posts';

  const sendData = (data, callBack, falseCallBack) => {
    const request = new XMLHttpRequest();
    request.open('POST', server);

    request.addEventListener('readystatechange', () => {
      if (request.readyState !== 4) return;
      if (request.status === 200 || request.status === 201) {
        const response = JSON.parse(request.responseText);
        callBack(response.id);
      } else {
        falseCallBack(request.responseText)
        throw new Error(request.statusText)
      }
    });

    request.send(data)
  };

const formElems = document.querySelectorAll('.form');

const formHandler = form => {
  const smallElem = document.createElement('small');
  form.append(smallElem);

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = {};
    let flag = true;

    const buttonSubmit = form.querySelector('.button[type="submit"]');

    for (const elem of form.elements) {
      const { name, value } = elem;
      if (name) {
        if (value.trim()) { //проверка на пробелы
          elem.style.border = '';
          data[name] = value.trim();
        } else {
          elem.style.border = '2px solid red';
          flag = false;
          elem.value = '';
        }
      }
    }

    if (!flag) {
      return smallElem.textContent = 'Заполните  все поля!';
    }

    sendData(JSON.stringify(data),
        (id) => {
          smallElem.innerHTML = 'Ваша заявка № ' + id + ' принята!' + '<br> В ближайшее время с Вами свяжутся!';
          smallElem.style.color = 'green';
          buttonSubmit.disabled = true;

          setTimeout(() => {
            smallElem.textContent = '';
            buttonSubmit.disabled = false;
          }, 8000)
        },
        (err) => {
          smallElem.innerHTML = 'Произошла ошибка сервера! Попробуйте еще раз позже!';
          smallElem.style.color = 'red';
        });
        form.reset();
  });
};

formElems.forEach(formHandler);

/*const notificationElem = document.createElement('notification');
const formBtn = document.querySelector('.form__button');

const notifySend = form => {
  formBtn.disabled = true;
  form.append(notificationElem);
  setTimeout(() => {
    notificationElem.remove();
    formBtn.disabled = false;
  }, 8000);
};

const formHandler = form => {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = {};

    for (const { name, value } of form.elements) {
      if (name) {
        data[name] = value;
      }
    }

    if (data.name && (data.phone || data.mail)) {
      sendData(JSON.stringify(data),
        id => {
          notificationElem.textContent = `Ваша заявка № ${id} принята! В ближайшее время с Вами свяжутся!`;
          notificationElem.style.color = 'green';
          notifySend(form);
        },
        () => {
          notificationElem.textContent =
            'Произошла ошибка сервера! Попробуйте еще раз позже!';
          notificationElem.style.color = 'red';
          notifySend(form);
        },
      );
      form.reset();
    } else {
      notificationElem.textContent = 'Введите Ваши контактные данные!';
      notificationElem.style.color = 'red';
      form.append(notificationElem);
      setTimeout(() => {
        notificationElem.remove();
      }, 5000);
    }
  });
};

formElems.forEach(formHandler);*/

  /*sendData(JSON.stringify(dataTest),
  (id) => {
    alert('Ваша заявка №' + id + '! \nВ ближайшее время с Вами свяжутся!')
  },
  (err) => {
    alert('Технические неполадки! Отправьте заявку позже!')
  });*/

});