export function Loading() {
  return (
    <>
      <div className="loading_bg"></div>
      
      <div className='Loading'>

        <div className='lds-spinner'>
          <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        </div>

        <p className='loading_sms'>Creating new child...</p>
      </div>
    </>
  )
}
