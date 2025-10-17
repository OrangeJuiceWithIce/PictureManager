package utils

import (
	"fmt"
	"strings"
	"time"
)

func ConverTimeFilter(timeFilter string) (result time.Time, err error) {
	now := time.Now()
	switch timeFilter {
	case "today":
		return now.Truncate(24 * time.Hour), nil
	case "week":
		return now.AddDate(0, 0, -7), nil
	case "month":
		return now.AddDate(0, -1, 0), nil
	case "year":
		return now.AddDate(-1, 0, 0), nil
	default:
		return time.Time{}, fmt.Errorf("invalid time option")
	}
}

func FilterEmptyString(list []string) (result []string) {
	for _, string := range list {
		if strings.TrimSpace(string) != "" {
			result = append(result, string)
		}
	}
	return result
}
