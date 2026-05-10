"use client";

import { faker } from "@faker-js/faker";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { createClient } from "@/lib/supabase/client";
import { Sparkles } from "lucide-react";

const formSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(30, "Title must be at most 30 characters."),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters.")
    .max(250, "Message must be at most 250 characters."),
});

export function PostForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      message: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const supabaseClient = createClient();
    const res = await supabaseClient
      .schema("guestbook")
      .from("posts")
      .insert(data);
    if (res.error) {
      toast.error("Failed to submit post. Please try again.", {
        description: `${res.statusText}(${res.status}): ${res.error.message}`,
      });
      return;
    }
    toast.success("Post submitted successfully!");
    form.reset();
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Create a new post</CardTitle>
        <CardDescription>
          Let us know what you thought of the website!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-title">Title</FieldLabel>
                  <Input
                    {...field}
                    id="form-rhf-demo-title"
                    aria-invalid={fieldState.invalid}
                    placeholder="In my opinion this is a 10/10"
                    autoComplete="off"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="message"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-message">
                    Message
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupTextarea
                      {...field}
                      id="form-rhf-demo-message"
                      placeholder="When navigating around the website I got to experience the best user experience of my life. I am in love ❤️"
                      rows={6}
                      className="min-h-24 resize-none"
                      aria-invalid={fieldState.invalid}
                    />
                    <InputGroupAddon align="block-end">
                      <InputGroupText className="tabular-nums">
                        {field.value.length}/250 characters
                      </InputGroupText>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter className="justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            form.clearErrors();
            form.setValues({
              title: faker.lorem.sentence({ min: 1, max: 3 }),
              message: faker.lorem.paragraph({ min: 1, max: 3 }),
            });
          }}
        >
          <Sparkles />
        </Button>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo">
            Post
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
