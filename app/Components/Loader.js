const Loader = ({ small }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-sky-500 ${small ? "h-4 w-4" : "h-8 w-8"}`}
      ></div>
    </div>
  )
}

export default Loader

