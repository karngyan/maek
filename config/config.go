package config

import (
	"log"
	"os"
	"strings"

	"github.com/knadh/koanf/providers/env"

	"github.com/knadh/koanf/parsers/toml"
	"github.com/knadh/koanf/providers/file"
	"github.com/knadh/koanf/v2"
)

type Config struct {
	*koanf.Koanf
}

func New() (*Config, error) {
	k := koanf.New(".")

	configFile := os.Getenv("CONFIG_FILE")
	if configFile == "" {
		log.Fatal("CONFIG_FILE environment variable is not set")
	}

	if _, err := os.Stat(configFile); os.IsNotExist(err) {
		log.Fatalf("configuration file does not exist: %s", configFile)
	}

	if err := k.Load(file.Provider(configFile), toml.Parser()); err != nil {
		log.Fatalf("error loading configuration file (%s): %v", configFile, err)
	}

	// e.g. export MAEK_API_SERVER__PORT=8081
	if err := k.Load(env.Provider("MAEK_", ".", func(s string) string {
		return strings.ToLower(strings.ReplaceAll(strings.TrimPrefix(s, "MAEK_"), "__", "."))
	}), nil); err != nil {
		log.Fatalf("error loading environment variables: %v", err)
	}

	c := &Config{k}

	if c.IsDev() {
		k.Print()
	}

	return c, nil
}

func (c *Config) IsDev() bool {
	return c.String("environment") == "development"
}

type ServiceMeta struct {
	Name string
}

func NewServiceMetaProvider(name string) func() *ServiceMeta {
	return func() *ServiceMeta {
		return &ServiceMeta{
			Name: name,
		}
	}
}
