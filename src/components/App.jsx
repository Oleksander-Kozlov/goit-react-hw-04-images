import React, { useEffect, useState, useRef } from 'react';

import Loader from './Loader/Loader.jsx';
import { Notify } from 'notiflix';
import { BTNLoadMore } from './Button/Button.jsx';
import { fetchPictures } from './Api/fetchPictures.js';
import ImageGallery from './ImageGallery/ImageGallery.jsx';
import { SearchBar } from './SearchBar/Searchbar.jsx';
import { ErMessage } from './SearchBar/ErMessage.jsx';

export const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchAr, setSearchAr] = useState([]);
  const [searchImg, setSearchImg] = useState('');
  const [page, setPage] = useState(1);
  const [isShow, setIsShow] = useState(false);
   const abortCtrl = useRef(null);
  
  // Сабміт форми
  const handleSabmit = input => {
    if (searchImg !== input) {
      setSearchImg(input)
      setSearchAr([]);
        setPage(1);
        setIsShow(false);};
    
 
  };
  
  //стилі для App
  const appStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    fontSize: 40,
    color: '#010101',
  };

  useEffect(() => {
    const fetchData = async () => {
      //
      if (searchImg === '' && page === 1) {
        return;
      }
      try {
        //ініціалізація абортконтролера
        // if (abortCtrl.current) {
        //   abortCtrl.current.abort();
        // }
        abortCtrl.current = new AbortController();
        setIsLoading(true);
        setError(null);
        //запит на API
        const images =   fetchPictures(searchImg, abortCtrl, page);

        // додаю у стан масив даних для  для галереї
        setSearchAr(prevSearchAr => {          
          return [
            ...prevSearchAr,
            ...images.hits.map(({ tags, id, largeImageURL, webformatURL }) => ({
              tags,
              id,
              largeImageURL,
              webformatURL,
            })),
          ];
        });
        setIsShow(true);
        // плавний скрол
        if (page !== 1) {
          window.scrollBy({
            top: 230 * 3,
            behavior: 'smooth',
          });
        }
        // Нотифікашка скільки є картинок по запиту
        
        if (images.totalHits) {
          
          Notify.info(`Hooray! We found ${images.totalHits} images.`);
        }

        //перевірка на останю партію картинок і приховання кнопки LoadMore
        if (images.hits.length < 12) {
          setIsShow(false);
          Notify.failure('Sorry, that is all results.');
        }
        
      } catch (error) {
        if (error.code !== 'ERR_CANCELED') {
          setError('Somethink was wrong! Please reloading the page.');
        }
      } finally {
        setIsLoading(false);
        
      }
    };
    fetchData();
  }, [searchImg, page]);

  //новий запит по кліку на LoadMore
  const newFetchImages =  () => {
    setPage((prevPage) =>  prevPage + 1)
  }
    
    
  return (
    <div style={appStyle}>
      <SearchBar
        handleSabmit={handleSabmit}
             />
      {isLoading && (
        // true
        <Loader />
      )}
      {error && <ErMessage>{error}</ErMessage>}
      <ImageGallery images={searchAr} />
      {isShow && <BTNLoadMore newFetchImages={newFetchImages} />}
    </div>
  );
};
// import { fetchPictures } from "./Api/fetchPictures.js";
// export class App extends Component {
//   // Переривач запитів
//   abortCtrl;
//   // Стан
//   state = {
//     isLoading: false,
//     error: null,
//     searchAr: [],
//     searchImg: '',
//     page: 1,
//     isShow: false,
//   };

// // Сабміт форми
// handleSabmit = input => {
//   this.setState({ searchImg: input });
// };
// //стилі для App
// appStyle = {
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'center',
//   alignItems: 'stretch',
//   fontSize: 40,
//   color: '#010101',
// };
//   // Життєвий цикл
//   async componentDidUpdate(_, nextState) {
//     // перевірка на однаковий ввід та повтор сторінок запиту
//     if (
//       this.state.searchImg === nextState.searchImg &&
//       this.state.page === nextState.page
//     ) {
//       return

//     }

//     // перевірка на новий пошук в інпуті
//     if (this.state.searchImg !== nextState.searchImg) {
//       this.setState({
//         searchAr: [],
//         page: 1,
//         isShow: false,
//       });
//     }
//     try {
//       const { searchImg, page } = this.state;
//       //ініціалізація абортконтролера
//       this.abortCtrl = new AbortController();
//       // зміна стану
//       this.setState({ isLoading: true, error: null });
//       //запит на API
//       const images = await fetchPictures(searchImg, this.abortCtrl, page);
//       // Нотифікашка скільки є картинок по запиту
//       if (images.totalhits) {
//         Notify.info(`Hooray! We found ${images.totalHits} images.`);
//       }
//       // додаю у стан масив даних для  для галереї
//       console.log(images.hits);

//       this.setState(
//         prevImages => ({
//           searchAr: [
//             ...prevImages.searchAr,
//             ...images.hits.map(({ tags, id, largeImageURL, webformatURL }) => ({
//               tags,
//               id,
//               largeImageURL,
//               webformatURL,
//             })),
//           ],
//           isShow: true,
//         }),
//         //плавний скрол
//         () => {
//           if (page !== 1)
//             window.scrollBy({
//               top: 260 * 3,
//               behavior: 'smooth',
//             });
//         }
//       );
//       //перевірка на останю партію картинок і приховання кнопки LoadMore
//       if (images.hits.length < 12) {
//         this.setState({
//           isShow: false,
//         });
//         Notify.failure('Sorry, that is all results.');
//       }
//     } catch (error) {
//       if (error.code !== 'ERR_CANCELED') {
//         this.setState({
//           error: 'Somethink was wrong! Please reloading the page.',
//         });
//       }
//     } finally {
//       this.setState({ isLoading: false });
//     }
// }

// //новий запит по кліку на LoadMore
// newFetchImages = () => {
//   this.setState({
//     page: this.state.page + 1,
//   });
// };

// render() {
//   const { isLoading, searchAr, isShow, error } = this.state;

//   return (
//     <div style={this.appStyle}>
//       <SearchBar
//         handleSabmit={this.handleSabmit}
//         handleChange={this.handleChange}
//       />
//       {isLoading && (
//         // true
//         <Loader />
//       )}
//       {error && <ErMessage>{error}</ErMessage>}
//       <ImageGallery images={searchAr} />
//       {isShow && <BTNLoadMore onChange={this.newFetchImages} />}
//     </div>
//   );
// }
