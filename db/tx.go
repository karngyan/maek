package db

import "context"

func Tx(ctx context.Context, f func(ctx context.Context, q *Queries) error) error {
	tx, err := defaultPgxPool.Begin(ctx)
	if err != nil {
		return err
	}

	q := New(tx)

	err = f(ctx, q)
	if err != nil {
		_ = tx.Rollback(ctx)
		return err
	}

	return tx.Commit(ctx)
}
