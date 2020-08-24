import React, { useCallback, useState } from 'react'
import axios from 'axios'

const GITHUB_API_URL = 'https://api.github.com'

function App() {
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [posts, setPosts] = useState([])
  const [post, setPost] = useState({})
  const [content, setContent] = useState('')
  const handleClick = useCallback(() => {
    axios.get(`${GITHUB_API_URL}/repos/saloiatv/website/contents/posts`, {
      headers: {
        'Authorization': `token ${password}`
      }
    }).then(({data}) => {
      setPosts(data)
    })
  }, [password, setPosts])
  const login = useCallback(() => {
    setLoggedIn(true)
  }, [setLoggedIn])
  const showContent = useCallback((post) => {
    setPost(post)
    axios.get(post.download_url).then(({data}) => {
      setContent(data)
    })
  }, [setPost])
  const save = useCallback(() => {
    const body = {
      message: post.name,
      sha: post.sha,
      content: btoa(content)
    }
    axios.put(`${GITHUB_API_URL}/repos/saloiatv/website/contents/${post.path}`, body, {
      headers: {
        'Authorization': `token ${password}`
      }
    }).then(() => {
      alert('Updated')
    })
  }, [post, password, content])
  return (
    <div className="App">
      {!loggedIn &&
        <div className="login">
          <input 
            placeholder="Password"
            type="text"
            name="password"
            onChange={(event) => setPassword(event.target.value)}
            value={password}
          />
          <button onClick={login}>Login</button>
        </div>
      }
      <br />
      <button onClick={handleClick}>
        List posts
      </button>
      <ul>
        {posts.map((post) => 
          <li onClick={() => showContent(post)}>{post.name}</li>
        )}
      </ul>
      <input
        type="text"
        name="content"
        onChange={(event) => setContent(event.target.value)}
        value={content} 
      />
      <button onClick={save}>
        Save
      </button>
    </div>
  )
}

export default App
