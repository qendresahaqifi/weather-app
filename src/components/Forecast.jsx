import React from "react";

const Forecast = ({ title, data }) => {
  return (
    <div className='text-white'>
      <div className='flex items-center justify-start mt-6'>
        <p className='font-medium uppercase'>{title}</p>
      </div>
      <hr className='my-1' />

      <div className='flex items-center justify-between'>
        {data.map(( d, index) => (
          <div key={index} className='flex flex-col items-center justify-center'>
            <p className='text-sm font-light'>{d.title}</p>
            <img src={d.icon} alt="weather icon" className='w-12 my-1' />
            <p className='font-medium'>{`${d.temp.toFixed()}°`}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Forecast;
