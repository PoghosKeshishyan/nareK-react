export function Loading({ loadingMessage }) {
  return (
    <>
      <div className="loading_bg"></div>

      <div className='Loading'>

        <div className='lds-spinner'>
          <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        </div>

        <p className='loading_sms'>{loadingMessage}</p>
      </div>
    </>
  )
}
