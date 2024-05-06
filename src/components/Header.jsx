import { API_URL } from '../config';

export function Header({ header }) {
  return (
    <header>
      <h1>{header.title}</h1>

      <div 
        className='logo'
        style={{backgroundImage: `url(${API_URL}${header.logo})`}}
      />
    </header>
  )
}
