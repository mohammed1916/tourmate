import React, { useEffect, useRef } from 'react';
import styles from '../styles/acrylicForm.module.css';

interface PlaceAutocompleteInputProps {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  id: string;
  zIndex?: number;
}

const PlaceAutocompleteInput: React.FC<PlaceAutocompleteInputProps> = ({ value, onChange, placeholder, id, zIndex }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pacRef = useRef<any>(null);

  useEffect(() => {
    if (!window.google?.maps?.places?.PlaceAutocompleteElement || !containerRef.current) return;

    containerRef.current.innerHTML = '';

    // Create the element with an empty options object
    const pac = new window.google.maps.places.PlaceAutocompleteElement({});
    pacRef.current = pac;
    containerRef.current.appendChild(pac);

    // Set value, placeholder, and id directly after creation
    setTimeout(() => {
      // @ts-ignore: value is supported at runtime
      pac.value = value || '';
      const input = pac.shadowRoot?.querySelector('input');
      if (input) {
        input.placeholder = placeholder;
        input.id = id;
        input.autofocus = true;
        input.focus();
      }
    }, 0);

    pac.addEventListener('gmp-placeautocomplete-placechange', (event: any) => {
      const place = event.target.value;
      onChange(place?.structured_formatting?.main_text || place?.description || '');
    });

    // Clean up
    return () => {
      pac.remove();
    };
  }, [value, placeholder, id, onChange]);

  let zClass = styles.autocompleteContainer;
  if (zIndex === 11000) zClass += ' ' + styles.autocompleteSource;
  if (zIndex === 10000) zClass += ' ' + styles.autocompleteDestination;
  return <div ref={containerRef} className={zClass} />;
};

export default PlaceAutocompleteInput;
