import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, timeout } from 'rxjs';

interface PostResponse {
  id: number;
  userId: number;
  title: string;
  body: string;
}

export interface Order {
  id: number;
  userId: number;
  title: string;
  description: string;
  amount: number;
  stock: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private apiUrl =
    'https://jsonplaceholder.typicode.com/posts';

  getOrders(): Observable<Order[]> {
    return this.http.get<PostResponse[]>(this.apiUrl).pipe(
      timeout({ first: 10000 }),
      map((posts) => posts.map((post) => ({
        id: post.id,
        userId: post.userId,
        title: post.title,
        description: post.body,
        amount: 25000 +Math.floor(Math.random() * 100000),
        stock: Math.floor(Math.random() * 10) + 1,
      })))
    );
  }
}
