function AuthField({ label, name, type, placeholder, value, error, onChange, inputRef }) {
  return (
    <div className="field-group">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        ref={inputRef}
        aria-invalid={Boolean(error)}
        autoComplete={name === 'password' ? 'new-password' : name === 'email' ? 'email' : 'name'}
        className={error ? 'has-error' : ''}
      />
      {error && <p className="field-error" role="alert">{error}</p>}
    </div>
  )
}

export default AuthField
