import React from 'react';
import { auth } from '@/styles/auth';

const Checkbox = ({ id, name, checked, onChange, label, description, link }) => {
  return (
    <label className={auth.checkbox.container} htmlFor={id} aria-label={label}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className={auth.checkbox.input}
      />
      <div className="flex-1">
        <div className={auth.checkbox.label}>{label}</div>
        {description && <p className={auth.checkbox.description}>{description}</p>}
        {link && (
          <button type="button" className={auth.link.primary}>
            {link}
          </button>
        )}
      </div>
    </label>
  );
};

export default Checkbox;
