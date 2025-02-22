package ysweet

import (
	"encoding/base64"
	"encoding/json"
	"errors"
)

func stringToBase64(input string) string {
	return base64.RawURLEncoding.EncodeToString([]byte(input))
}

func base64ToString(input string) (string, error) {
	decoded, err := base64.RawURLEncoding.DecodeString(input)
	if err != nil {
		return "", errors.New("unable to decode from Base64")
	}

	return string(decoded), nil
}

func EncodeClientToken(token ClientToken) (string, error) {
	jsonData, err := json.Marshal(token)
	if err != nil {
		return "", err
	}
	return stringToBase64(string(jsonData)), nil
}

func DecodeClientToken(token string) (ClientToken, error) {
	jsonString, err := base64ToString(token)
	if err != nil {
		return ClientToken{}, err
	}

	var clientToken ClientToken
	err = json.Unmarshal([]byte(jsonString), &clientToken)
	if err != nil {
		return ClientToken{}, err
	}

	return clientToken, nil
}
