// import React, { Component } from 'react';
// import NewsItem from './NewsItem';

// export default class News extends Component {
//   constructor(props) {
//     super(props);
//     console.log("Hello, I am a constructor component");
//     this.state = {
//       articles: [],
//       loading: false,
//       page: 1,
//       totalResults: 0 // Added totalResults to the initial state
//     };
//   }

//   async componentDidMount() {
//     console.log("cdm");
//     let url = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=5dc8d9606b5d4692ba62d6ea4ff9210b&page=1&pageSize=${this.props.pageSize}`;
//     let data = await fetch(url);
//     let parsedData = await data.json();
//     console.log(parsedData);
//     this.setState({ articles: parsedData.articles, totalResults: parsedData.totalResults });
//   }

//   handlePreviousClick = async () => {
//     console.log("Previous");
//     let url = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=5dc8d9606b5d4692ba62d6ea4ff9210b&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
//     let data = await fetch(url);
//     let parsedData = await data.json();
//     console.log(parsedData);
//     this.setState({
//       page: this.state.page - 1,
//       articles: parsedData.articles
//     });
//   }

//   handleNextClick = async () => {
//     console.log("Next");
//     if (this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)) {
//       // Check if next page exceeds total pages
//       return;
//     }

//     let url = `https://newsapi.org/v2/top-headlines?sources=techcrunch&apiKey=5dc8d9606b5d4692ba62d6ea4ff9210b&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
//     let data = await fetch(url);
//     let parsedData = await data.json();
//     console.log(parsedData);
//     this.setState({
//       page: this.state.page + 1,
//       articles: parsedData.articles
//     });
//   }

//   render() {
//     return (
//       <div className="container my-3">
//         <h2>Top headlines</h2>
//         <div className="row">
//           {this.state.articles.map((element) => (
//             <div className="col-md-4" key={element.url}>
//               <NewsItem
//                 title={element.title ? element.title.slice(0, 45) : "No Title"}
//                 description={element.description ? element.description.slice(0, 88) : "No Description"}
//                 imageUrl={element.urlToImage ? element.urlToImage : ""}
//                 newsUrl={element.url ? element.url : ""}
//               />
//             </div>
//           ))}
//           <div className='container d-flex justify-content-between'>
//             <button disabled={this.state.page <= 1} type="button" className='btn btn-dark' onClick={this.handlePreviousClick}>&larr; Previous</button>
//             <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" className='btn btn-dark' onClick={this.handleNextClick}>Next &rarr;</button>
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
import React, { useEffect, useState } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalResults, setTotalResults] = useState(0);

    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const updateNews = async () => {
        props.setProgress(10);
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
        setLoading(true);
        let data = await fetch(url);
        props.setProgress(30);
        let parsedData = await data.json();
        props.setProgress(70);
        setArticles(parsedData.articles || []); // Ensure articles is an array
        setTotalResults(parsedData.totalResults);
        setLoading(false);
        props.setProgress(100);
    };

    useEffect(() => {
        document.title = `${capitalizeFirstLetter(props.category)} - NewsCraze`;
        updateNews();
        // eslint-disable-next-line
    }, []);

    const fetchMoreData = async () => {
        const nextPage = page + 1;
        const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${nextPage}&pageSize=${props.pageSize}`;
        setPage(nextPage);
        let data = await fetch(url);
        let parsedData = await data.json();
        setArticles([...articles, ...(parsedData.articles || [])]); // Concatenate new articles to existing articles
        setTotalResults(parsedData.totalResults);
    };

    return (
        <>
            <h1 className="text-center" style={{ margin: '35px 0px', marginTop: '90px' }}>NewsCraze - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
            {loading && <Spinner />}
            <InfiniteScroll
                dataLength={articles.length}
                next={fetchMoreData}
                hasMore={articles.length !== totalResults}
                loader={<Spinner />}
            >
                <div className="container">
                    <div className="row">
                        {articles.map((element) => (
                            <div className="col-md-4" key={element.url}>
                                <NewsItem
                                    title={element.title ? element.title : ""}
                                    description={element.description ? element.description : ""}
                                    imageUrl={element.urlToImage}
                                    newsUrl={element.url}
                                    author={element.author}
                                    date={element.publishedAt}
                                    source={element.source.name}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </InfiniteScroll>
        </>
    );
};

News.defaultProps = {
    country: 'in',
    pageSize: 8,
    category: 'general',
};

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
};

export default News;
