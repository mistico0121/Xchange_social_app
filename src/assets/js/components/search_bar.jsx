import React, { Fragment, useState } from 'react';
import { hot } from 'react-hot-loader';

export default function SearchBar({ data }) {
  const searchPath = JSON.parse(data).searchpath;
  const [minl, setMinl] = useState(0);
  const [search, setSearch] = useState('');
  const [searchList, setSearchList] = useState([]);

  async function fetchServer(e) {
    e.preventDefault();
    const localsearch = e.target.value;
    setSearch(localsearch);
    const rdata = {
      search: localsearch,
    };
    if (localsearch.length >= 3) {
      const ans = await fetch(searchPath, { method: 'POST', body: JSON.stringify(rdata) }).then((r) => r.json());
      setSearchList(ans);
      setMinl(1);
    } else {
      setMinl(0);
      setSearchList();
    }
  }

  function clickOption(elem, key) {
    const e = `${elem.name || elem.title}`;
    setSearch(e);
    document.getElementById('search_input').focus();

    if (key === "groupsList") {
      window.location.href = `/groups/${elem.id}`
    } else if (key === "usersList"){
      window.location.href = `/users/${elem.username}`
    } else if (key === "publicationsList") {
      window.location.href = `/publications/${elem.id}`;
    }
  }

  return (
    <Fragment>
      <form className="search_bar_form" action={searchPath} method="post">
        <input className="search" name="search" type="text" id="search_input"
               placeholder="Busqueda de grupos, personas, items."
               onChange={fetchServer}
               value={search}
               autoComplete="off"
        />
      </form>
      {
        minl ?
          <div className="search-popup round-1">{
            Object.keys(searchList)
              .map((key, i) => {
                let groupTag = '';
                if (key === "groupsList") {
                  groupTag = "Grupo"
                } else if (key === "usersList"){
                  groupTag = "Usuario"
                } else if (key === "publicationsList") {
                  groupTag = "Publicación"
                }
                return searchList[key].map((elem, j) => {
                  return <div className="hover-pointer hover-background padded row space-between"
                              key={`id ${i} ${j} ${elem.name || elem.title}`}
                              onClick={() => clickOption(elem, key)}
                  ><div>{elem.name || elem.title}</div><div className="bold italic">{groupTag}</div></div>;
                });
              })}</div>
          : null
      }
    </Fragment>
  );
}

// export default hot(module)(App);
