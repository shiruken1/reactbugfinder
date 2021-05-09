import './App.css';

import axios from 'axios';
import React, {  useState } from 'react';

export default function App() {
  const [ loading, setLoading ] = useState(false);
  const [ inputText, setInputText ] = useState('');
  const [ activeIssue, setActiveIssue ] = useState(-1);
  const [ dropdownData, setDropdownData ] = useState([]);

  const getIssues = async input => {
    // render it
    setInputText(input);

    // let's be a good API citizen
    if(input.length < 4) {
      return;
    }

    setLoading(true);

    const response = await axios.get('http://localhost:3333/search?q='+input);

    if(!response.data || !response.data.items) {
      return '';
    }

    const { data: { items }} = response;

    let issues = [];

    // clue the users the app isn't broken
    if(!items.length) {
      issues.push({
        url: '#',
        id: false, // no issue? no result
        title: '',
        labels: '',
      });
    } else {

      issues = items.map(i => {
         let labels = i.labels.reduce((accumulator, label) => accumulator += `${label.name}, `, ' ');
         // remove trailing comma
         labels = labels.slice(0, -2);

        return {
          id: i.id,
          title: i.title,
          url: i.html_url,
          labels
        };
      });
    }

    setDropdownData(issues);
    setLoading(false);

    return response;
  };

  const keyNav = event => {
    if(event.key === 'ArrowDown') {
      if(activeIssue < dropdownData.length-1) {
        setActiveIssue(activeIssue+1);
      }

    } else if(event.key === 'ArrowUp') {
      if(activeIssue > 0) {
        setActiveIssue(activeIssue-1);
      } else {
        setActiveIssue(-1);
      }

    } else if(event.key === 'Enter') {
      window.open(dropdownData[activeIssue].url);

    } else if(event.key === 'Backspace' && inputText.length < 2) {
      // clear the list and reset index for better UX
      setDropdownData([]);
      setActiveIssue(-1);
    }
  };

  return (
    <div className="dropdown">

      <input
        type="text"
        value={inputText}
        className="myInput"
        onKeyDown={keyNav}
        placeholder="Search bugs in React's repo"
        onChange={({ target: { value }}) => getIssues(value)} />

        <ul className="dropdown-content">
          { loading ? ( <b>loading...</b>) : (
            dropdownData.map((issue, i) => {
              return !issue.id ? ( <p key="1">No results found</p> ) : (

                <li id={i} key={i} className={i === activeIssue ? 'active' : null }>
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href={issue.url}
                    className={i === activeIssue ? 'active' : null }>
                    <span className="title">{issue.title}</span>
                    &nbsp;Labels:<span className="labels">{issue.labels}</span>
                  </a>
                </li>
              );
          }))}
        </ul>

    </div>
  );

}