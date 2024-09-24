// Button.jsx
import PropTypes from 'prop-types';
import './Button.css';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'medium',
  disabled = false,
  ...props
}) => {
  
  return (
    <button type={type} className={`button ${variant} ${size}`}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.string,
  variant: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;

// Como usar
// import Button from './components/Button';
// function App() {
//   return (
//     <div>
//       <Button variant="primary" size="medium" onClick={() => alert('Primary Button')}>
//         Primary Button
//       </Button>
//       <Button variant="secondary" size="small">
//         Secondary Button
//       </Button>
//       <Button variant="success" size="large" disabled>
//         Disabled Button
//       </Button>
//     </div>
//   );
// }
// export default App;