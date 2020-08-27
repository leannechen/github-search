import React, { useCallback, useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCircle, faSearch, faSyncAlt, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import imgCat from "./img/coding-cat.jpg";
import appStyle from "./App.module.css";

function debounce(func, delay) {
  var timer = null;
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      func.apply(context, args)
    }, delay);
  }
}

function App() {

  const [ keyword, setKeyword ] = useState("");
  const [ page, setPage ] = useState(1);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ repoList, setRepoList ] = useState([]);
  const [ totalCount, setTotalCount ] = useState(0);
  const [ isObservingScroll, setIsObservingScroll ] = useState(false);

  // in order to access latest `page`
  const pageRef = useRef();
  pageRef.current = page;

  const keywordRef = useRef();
  keywordRef.current = keyword;

  const loadingRef = useRef(null);

  const debouncedPageSearch = useCallback(
    debounce(
      ({ keyword, page }) => {
        makeRequest({
          q: keyword,
          page,
        }, false);
        setPage(page);
      },
      750
    ),
    []
  );

  useEffect(() => {

    let observer;
    const targetEl = loadingRef.current;
    const latestKeyword = keywordRef.current;

    if (!latestKeyword) {
      if(observer) {
        observer.unobserve(targetEl);
      }
      setIsObservingScroll(false);
    } else if(latestKeyword && !isObservingScroll) {

      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 0 // 0~1
      };

      const handleObserver = (entries, observer) => {
        const { isIntersecting } = entries[0];
        if(isIntersecting && keywordRef.current) {
          const nextPage = pageRef.current + 1;
          debouncedPageSearch({
            keyword: keywordRef.current,
            page: nextPage,
          });
        }
      };

      observer = new IntersectionObserver(
        handleObserver,
        options
      );

      if(targetEl) {
        observer.observe(targetEl);
        setIsObservingScroll(true);
      }
    }

  }, [debouncedPageSearch, isObservingScroll, keyword]);

  const makeRequest = (params, isInitialRequest) => {

    setIsLoading(true);

    const requestConfig = {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/vnd.github.v3+json",
      },
      mode: 'cors',
      cache: 'default',
    };

    const paramsObj = new URLSearchParams(params);

    return fetch('https://api.github.com/search/repositories?'+ paramsObj, requestConfig)
      .then(function(response) {
        if(response.ok) {
          return response.json();
        }
        throw new Error('Network response was not ok.');
      })
      .then(function (result) {
        setIsLoading(false);
        const { items, total_count } = result;
        if(isInitialRequest) {
          setRepoList(items);
        } else {
          setRepoList(repoList => [ ...repoList, ...items ]);
        }
        setTotalCount(total_count);
      })
      .catch(function(error) {
        setIsLoading(false);
        alert('There has been a problem with your fetch operation: ', error.message);
      });
  };

  const debouncedKeywordSearch = useCallback(
    debounce(
      (keyword) => {
        makeRequest({
          q: keyword,
          page: 1,
        }, true);
      },
      750
    ),
    []
  );


  const handleInputChange = (e) => {

    setKeyword(e.target.value);
    setPage(1);

    if(e.target.value === "") {
      setRepoList([]);
      setTotalCount(0);
      setIsLoading(false);
      setIsObservingScroll(false);

      return;
    }

    debouncedKeywordSearch(e.target.value);
  };

  const renderCards = () => {
    return repoList.map((repo, index) => (
      <li key={repo.full_name} className={appStyle.card}>
        <a href={repo.svn_url} className={appStyle.cardLink} target="_blank" rel="noopener noreferrer">
          <div>
            <h2 className={appStyle.cardTitle}>{repo.full_name}</h2>
            <p className={appStyle.cardDesc}>{repo.description}</p>
          </div>
          <div>
            <div className={appStyle.cardLabelContainer}>
          <span className={appStyle.cardLabel}>
            <FontAwesomeIcon icon={faStar} className={`${appStyle.cardIcon} ${appStyle.iconStar}`} />
            <span>{repo.stargazers_count}</span>
          </span>
              <span className={appStyle.cardLabel}>
            <FontAwesomeIcon icon={faCircle} className={`${appStyle.cardIcon} ${appStyle.iconCircle}`} />
            <span>{repo.language}</span>
          </span>
            </div>
            <div className={appStyle.cardFooter}>
              <span className={appStyle.cardFootNote}>{repo.license? repo.license.name: "No license specified"}</span>
            </div>
          </div>
        </a>
      </li>
    ))
  };

  return (
    <div className={appStyle.app}>
      <main className={appStyle.main}>
        <header className={appStyle.header}>
          <h1 className={appStyle.siteTitle}>Search Github Repositories</h1>
          <img src={imgCat} alt="Coding Cat" className={appStyle.imgCat} />
          <div className={appStyle.searchInputContainer}>
            <input
              type="text"
              key="searchInput"
              autoFocus
              className={appStyle.searchInput}
              placeholder="Type something for search"
              onChange={handleInputChange}
              disabled={isLoading}
            />
            { isLoading ?
              <FontAwesomeIcon
                icon={faCircleNotch}
                className={appStyle.iconSpinnerInInput}
                spin
              />
              :
              <FontAwesomeIcon icon={faSearch} className={appStyle.iconSearch} />
            }
          </div>
          <p className={appStyle.dataCount}>{totalCount} results</p>
        </header>
        <div className={appStyle.resultContainer}>
          { (repoList.length === 0 && !isLoading) && <p>目前沒有任何資料</p> }
          <div>
            <ul className={appStyle.cardList}>
              { renderCards() }
            </ul>
            <div
              ref={loadingRef}
              style={{ height: `100px`, margin: `30px` }}
              className={appStyle.loadingContainer}
            >
              { isLoading &&
                <FontAwesomeIcon
                  icon={faSyncAlt}
                  spin
                  size="lg"
                  className={appStyle.iconSpinner}
                />
              }
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
