import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { todo } from "@/lib/schema";
import { eq, and } from "drizzle-orm";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, priority, dueDate, completed } = body;

    // Validate that the todo belongs to the user
    const existingTodo = await db
      .select()
      .from(todo)
      .where(and(eq(todo.id, params.id), eq(todo.userId, session.user.id)))
      .limit(1);

    if (existingTodo.length === 0) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    const updateData: Partial<typeof todo.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (title !== undefined) {
      if (typeof title !== "string" || title.trim().length === 0) {
        return NextResponse.json(
          { error: "Title must be a non-empty string" },
          { status: 400 }
        );
      }
      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description = description?.trim() || null;
    }

    if (priority !== undefined) {
      if (typeof priority !== "number" || priority < 0 || priority > 2) {
        return NextResponse.json(
          { error: "Priority must be a number between 0 and 2" },
          { status: 400 }
        );
      }
      updateData.priority = priority;
    }

    if (dueDate !== undefined) {
      updateData.dueDate = dueDate ? new Date(dueDate) : null;
    }

    if (completed !== undefined) {
      updateData.completed = Boolean(completed);
    }

    const updatedTodo = await db
      .update(todo)
      .set(updateData)
      .where(and(eq(todo.id, params.id), eq(todo.userId, session.user.id)))
      .returning();

    return NextResponse.json(updatedTodo[0]);
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate that the todo belongs to the user
    const existingTodo = await db
      .select()
      .from(todo)
      .where(and(eq(todo.id, params.id), eq(todo.userId, session.user.id)))
      .limit(1);

    if (existingTodo.length === 0) {
      return NextResponse.json({ error: "Todo not found" }, { status: 404 });
    }

    await db
      .delete(todo)
      .where(and(eq(todo.id, params.id), eq(todo.userId, session.user.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting todo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
