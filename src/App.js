import React, {useEffect, useState} from "react";
import Tmdb from "./Tmdb";
import MovieRow from "./components/MovieRow";
import FeaturedMovie from "./components/FeaturedMovie";
import Header from "./components/Header";
import "./App.css"

export default () => {

    const [movieList, setMovieList] = useState([]);
    const [featuredData, setFeaturedData] = useState(null)
    const [blackHeader, setBlackHeader] = useState(false)


    useEffect(() => {
        const loadAll = async () => {
            //get list
            let list = await Tmdb.getHomeList();
            setMovieList(list);
            
            //get featured
            let originals = list.filter(i => i.slug === 'originals');
            let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
            let chosen = originals[0].items.results[randomChosen];
            let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')

            setFeaturedData(chosenInfo);
        }

        loadAll()

    }, []);

    useEffect(() => {
        const scrollListener = () => {
            if(window.scrollY > 10) {
                setBlackHeader(true)
            }
            else {
                setBlackHeader(false)
            }
        }

        window.addEventListener('scroll', scrollListener);

        return () => {
            window.removeEventListener('scroll', scrollListener);
        }
    }, []);

    return (

        <div className="page">

            <Header black={blackHeader}/>

            {featuredData &&
                <FeaturedMovie item={featuredData}/>
            }
            
            
            <section className="lists">
                {movieList.map((item, key) => (
                    <MovieRow key={key} title={item.title} items={item.items}/>
                ))}
            </section>

            <footer>
                <div className="footer--content">
                    API utilizada - <a href="https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&cad=rja&uact=8&ved=2ahUKEwiYkoTqxc3zAhWurJUCHUJ7BOsQFnoECBEQAQ&url=https%3A%2F%2Fdevelopers.themoviedb.org%2F3&usg=AOvVaw1EE8OsHDg8JkR4SrWGHSPw"> <strong>TMDB</strong></a><br />
                    Direitos de imagens - <strong> Netflix </strong><br />
                   <a href="https://www.linkedin.com/in/rodolfo-belo-5786b21a0/"> <strong> Rodolfo Belo </strong> </a><br />
                </div>
            </footer>

            {movieList.length <= 0 &&
                <div className="loading">
                    <img src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif" width="500"  alt="Carregando"></img>
                </div>
            }      
        </div>
    )

    
}