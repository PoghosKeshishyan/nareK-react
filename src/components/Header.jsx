export function Header({ header }) {
  return (
    <header>
      <h1>{header.title}</h1>

      <div 
        className='logo'
        style={{backgroundImage: `url(http://localhost:8000/${header.logo})`}}
      />
    </header>
  )
}
